package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.*
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.entity.Product
import com.catprogrammer.pim.service.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.util.*
import javax.servlet.http.HttpServletResponse
import kotlin.concurrent.thread


@RequestMapping("/api/woo")
@RestController
class WooController(
    private val wooService: WooService,
    private val categoryService: CategoryService,
    private val productService: ProductService,
    private val variationAttributeService: VariationAttributeService,
    private val settingsService: SettingsService,
    private val miscService: MiscService,
    private val mapper: ObjectMapper,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    private var jobLog: MutableList<String> = mutableListOf() // one job at a time
    private var jobRunning = false

    private fun debug(text: String) {
        logger.debug(text)
        jobLog.add("D: $text")
    }

    private fun error(text: String, e: Exception) {
        logger.error(text, e)
        jobLog.add("E: $text")
        jobLog.add("E: ${e.message}")
    }

    @GetMapping("/log")
    fun getLog() = jobLog

    @GetMapping("/job-running")
    fun isJobRunning() = jobRunning

    @PostMapping("/export-categories")
    fun exportCategoriesToWoo(): RestResponse<String> {
        if (jobRunning) {
            return RestResponse.failResponse("A job is running.")
        }

        jobLog.clear()
        jobRunning = true
        thread(start = true) {
            debug("Start Export Categories To Woo")

            try {
                val wooCatgs: MutableMap<Long, CategoryWoo> =
                    wooService.getCategories().associateBy { it.id }.toMutableMap()
                debug("Woo has ${wooCatgs.size} categories")

                val allCategories = categoryService.findAll()
                debug("PIM has ${allCategories.size} categories")

                val levelArrays = buildCatgLevelArrays(allCategories)

                val locales: List<PimLocale> = settingsService.getPimLocales()
                debug("PIM has ${locales.size} locales: $locales")

                // check if saved wooId still exists
                allCategories.forEach { c ->
                    c.idWoo.retainAll { idWithLang ->
                        val id = idWithLang.split("#")[0]
                        val exist = wooCatgs.containsKey(id.toLong())

                        if (!exist) {
                            debug("Woo Category Id $id does not exist anymore")
                        }

                        return@retainAll exist
                    }
                    categoryService.save(c)
                }

                // create/update categories in woo
                debug("create/update categories in woo")
                levelArrays.forEachIndexed { index, catgs ->
                    debug("- Level $index...")
                    catgs.forEach { c ->
                        debug("-- Handle Category ${c.id}")

                        // find lang that already created in woo
                        // Pair: countryCode to idWoo
                        val createdLang: MutableList<Pair<String, Long>> =
                            c.idWoo.map {
                                val split = it.split("#")
                                return@map split[1] to split[0].toLong()
                            }.toMutableList()

                        debug("-- idWoo of Category ${c.id}: ${c.idWoo}")
                        debug("-- Created Langs In woo: $createdLang")

                        // foreach created lang: update
                        debug("-- Update existing category lang...")
                        createdLang.forEach { pair ->
                            val languageCode = pair.first
                            val wooCatgId = pair.second
                            val locale = locales.first { it.languageCode == languageCode }
                            debug(
                                "--- Push PIM category ${c.id} to update Woo Category $wooCatgId with lang $languageCode"
                            )

                            // update
                            val updatedCatgWoo =
                                wooService.updateCategory(c, locale, wooCatgId, allCategories, wooCatgs[wooCatgId])

                            // update wooCatgs map with updated catgWoo
                            wooCatgs[updatedCatgWoo.id] = updatedCatgWoo

                            debug("--- Update OK")
                        }

                        // foreach not created lang: create
                        debug("-- Create missing category lang...")
                        locales
                            // find all lang which are not in createdLang
                            .filter { locale ->
                                !createdLang.map(Pair<String, Long>::first).contains(locale.languageCode)
                            }
                            // create the catg woo with this lang
                            .forEach { locale ->
                                debug(
                                    "--- Push PIM category ${c.id} to CREATE NEW Woo Category with lang ${locale.languageCode}"
                                )

                                // create
                                val createdCatgWoo = wooService.createCategory(c, locale, allCategories)

                                // update all woo catgs map
                                wooCatgs[createdCatgWoo.id] = createdCatgWoo

                                // save the created catgWoo id in catg object
                                val idWoo = "${createdCatgWoo.id}#${locale.languageCode}"
                                c.idWoo.add(idWoo)
                                c.needUpdateTranslationGroup = true
                                debug("--- id woo $idWoo added to Category ${c.id}")
                                debug("--- Latest value: ${c.idWoo}")

                                debug("--- Create OK, created woo category with id ${createdCatgWoo.id}")
                            }

                        // save the catg
                        categoryService.save(c)
                        debug("-- Saved PIM Category Object ${c.id}")
                    }
                    debug("- Level $index end")
                }

                // set the translation attr in woo
                debug("Update translations attributes...")
                allCategories.forEach { c ->
                    if (c.needUpdateTranslationGroup) {
                        debug("- Update Category id ${c.id} with idWoo ${c.idWoo}")
                        wooService.updateTranslationsAttr(c.idWoo, wooService.categoriesUrl)
                    } else {
                        debug("- Category id ${c.id} translation group not changed: idWoo ${c.idWoo}")
                    }
                }

                // set menu_order
                var menuOrder = 1L
                allCategories.sortedBy { it.menuOrder }.forEach { c ->
                    debug("- Update Category menuOrder ${c.id}")
                    menuOrder = wooService.updateCategoryMenuOrder(c, menuOrder)
                }

                // delete any woo categories which are not in the PIM
                debug("Delete any woo categories which are not in the PIM...")
                val idSet: Set<Long> = allCategories
                    .asSequence()
                    .map(Category::idWoo)
                    .flatten()
                    .map { it.split("#")[0].toLong() }
                    .toSet()

                wooCatgs.keys
                    .filter { !idSet.contains(it) }
                    .forEach {
                        debug("- Delete woo category with woo id $it")
                        wooService.deleteCategory(it)
                    }
            } catch (e: Exception) {
                error("Export Categories Error", e)
            }

            debug("End Export Categories To Woo")
            jobRunning = false
        }

        return RestResponse.successResponse("Job started")
    }

    @GetMapping("/export-products")
    fun exportProductsToCsv(
        response: HttpServletResponse,
        @RequestParam(name = "categories", required = false)
        categoryIds: Array<Long>?,
        @RequestParam(name = "since", required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        since: OffsetDateTime?
    ): ResponseEntity<String> {
        if (categoryIds != null && categoryIds.isNotEmpty() && since != null) {
            return ResponseEntity.badRequest()
                .body("Param 'categories' and param 'since' can not be used in same time.")
        }

        val now = OffsetDateTime.now()
        val pdts = if (categoryIds == null || categoryIds.isEmpty()) {
            if (since != null) {
                productService.getUpdatedProductSince(since)
            } else {
                productService.findAllNotDeleted()
            }
        } else {
            val all = productService.findAllNotDeleted()
            val p = mutableListOf<Product>()
            categoryIds.forEach {
                p.addAll(productService.findAllByCategoryId(it, all))
            }
            p.distinctBy { it.id }
        }

        if (pdts.isEmpty()) {
            return ResponseEntity.ok("No product.")
        }

        val csv = wooService.exportProductsToCsv(
            pdts,
            categoryService.findAll(),
            settingsService.getProductAttributes(),
            variationAttributeService.findAll(),
            settingsService.getPimLocales()
        )

        // save export time in misc
        if (since != null) {
            miscService.save(MiscRequest("lastProductCsvExport", now.toString()))
        }

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${LocalDateTime.now()}.csv\"")
            .body(csv)
    }

    @PostMapping("/export-product-attributes")
    fun exportProductAttributesToWoo(): RestResponse<String> {
        if (jobRunning) {
            return RestResponse.failResponse("A job is running.")
        }

        jobLog.clear()
        jobRunning = true

        thread(start = true) {
            debug("Start Export Product Attributes To Woo")

            try {
                val attrsInPim = variationAttributeService.findAll()
                val attrsWooNames = wooService.getProductAttributes().map { it.name }.toSet()

                // create product attributes that not exists in woo
                debug("Create product attributes that not exists in woo...")
                attrsInPim.forEach {
                    if (!attrsWooNames.contains(it.name)) {
                        debug("Creating product attribute ${it.name}...")
                        wooService.createProductAttribute(it)
                    }
                }

                val attrsWoo = wooService.getProductAttributes()

                debug("Create product attribute terms that not exists in woo...")
                attrsWoo.forEach { attrWoo ->
                    val attrInPim = attrsInPim.firstOrNull { it.name == attrWoo.name }
                    if (attrInPim == null) {
                        debug("Product Attribute ${attrWoo.name} exists in woo but not found in PIM, skipped.")
                        return@forEach
                    }

                    // create product attribute terms that not exists for this attr in woo
                    debug("Create product attribute terms that not exists for attr ${attrInPim.name} id ${attrInPim.id} in woo...")
                    val termsNeedToUpdateTranslationGroupList = ArrayList<Long>()
                    var termsWoo = wooService.getProductAttributeTerms(attrWoo.id)
                    attrInPim.terms.forEachIndexed { iTerm, term ->
                        term.translations.forEach { translation ->
                            val found =
                                termsWoo.find { it.lang == translation.lang && it.description.endsWith("#${term.name}") }
                            if (found == null) {
                                debug("Term ${term.name} of lang ${translation.lang} not exist in woo, creating...")
                                wooService.createProductAttributeTerm(
                                    attrWoo.id,
                                    translation.translation,
                                    translation.lang,
                                    "#${term.name}",
                                    iTerm.toLong()
                                ) // save term name to description, to recognize translation group
                                termsNeedToUpdateTranslationGroupList.add(term.id)
                            } else {
                                if (found.name != translation.translation) {
                                    debug(
                                        "Term ${term.name} of lang ${translation.lang} not exist in woo, but text is changed, updating..."
                                    )
                                    wooService.updateProductAttributeTerm(
                                        attrWoo.id,
                                        found.id,
                                        translation.translation,
                                        iTerm.toLong()
                                    )
                                }
                            }
                        }
                    }

                    // refresh product attribute term list from woo
                    debug("Refresh product attribute term list from woo...")
                    termsWoo = wooService.getProductAttributeTerms(attrWoo.id)

                    // update translation group
                    debug("Update translation group...")
                    attrInPim.terms.forEach { term ->
                        if (termsNeedToUpdateTranslationGroupList.contains(term.id)) {
                            val translationGroup = termsWoo.filter { it.description.split("#").last() == term.name }
                            val log = translationGroup.joinToString(", ") { "${it.lang} - ${it.id}" }
                            debug("Term ${term.name} - Translation Group: $log")
                            wooService.updateTranslationsAttr(
                                translationGroup.map { "${it.id}#${it.lang}" }.toSet(),
                                wooService.getProductAttributeTermsUrl(attrWoo.id)
                            )
                        } else {
                            debug("Term ${term.name} - Translation Group no need to update.")
                        }
                    }
                }
            } catch (e: Exception) {
                error("Export Error", e)
            }

            debug("End Export Product Attributes To Woo")
            jobRunning = false
        }

        return RestResponse.successResponse("Job started")
    }

    @GetMapping("/products/{sku}")
    fun getProduct(@PathVariable sku: String): RestResponse<List<ProductWoo>> =
        RestResponse.successResponse(wooService.getProduct(sku))

    @PostMapping("/stock/")
    fun setProductStock(@RequestBody rq: FrontUpdateWooProductStockRequest): RestResponse<ProductWoo> =
        RestResponse.successResponse(wooService.setProductStock(rq.id, rq.stockQuantity, rq.parentId))

    @PostMapping("/find-products-not-exist-in-pim")
    fun findProductsNotExistInPim(): RestResponse<String> {
        if (jobRunning) {
            return RestResponse.failResponse("A job is running.")
        }

        jobLog.clear()
        jobRunning = true

        thread(start = true) {
            debug("findProductsNotExistInPim started, this will take a few minutes")
            try {
                val res = wooService.findProductsNotExistInPim()
                debug(mapper.writerWithDefaultPrettyPrinter().writeValueAsString(res))
            } catch (e: Exception) {
                error("findProductsNotExistInPim failed", e)
            }
            jobRunning = false
        }

        return RestResponse.successResponse("Job started")
    }

    private fun buildCatgLevelArrays(catgs: List<Category>): ArrayList<List<Category>> {
        debug("Start buildCatgLevelArrays, size = ${catgs.size}")

        var totalFound = 0
        val arrays = ArrayList<List<Category>>()
        val parents = HashSet<Long>()

        while (totalFound < catgs.size) {
            val found = catgs.filter {
                return@filter if (parents.isEmpty()) {
                    it.parentId == null
                } else {
                    parents.contains(it.parentId)
                }
            }

            debug("Iteration ${arrays.size + 1}: found size = ${found.size}")

            if (found.isNotEmpty()) {
                totalFound += found.size
                arrays.add(found)
                parents.clear()
                parents.addAll(found.map(Category::id))
            } else {
                this.logger.warn("buildCatgLevelArrays error, remains categories with unknown parent. total catgs = ${catgs.size}, built arrays contains = $totalFound")
                break
            }
        }

        debug("End buildCatgLevelArrays, size = ${catgs.size} totalFound = $totalFound")

        return arrays
    }
}
