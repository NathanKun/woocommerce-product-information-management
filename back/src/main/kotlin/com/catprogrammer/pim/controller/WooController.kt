package com.catprogrammer.pim.controller

import com.catprogrammer.pim.dto.CategoryWoo
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.service.CategoryService
import com.catprogrammer.pim.service.ProductService
import com.catprogrammer.pim.service.SettingsService
import com.catprogrammer.pim.service.WooService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.PrintWriter
import java.time.LocalDateTime
import java.util.*
import javax.servlet.http.HttpServletResponse


@RequestMapping("/api/woo")
@RestController
class WooController(
    private val wooService: WooService,
    private val categoryService: CategoryService,
    private val productService: ProductService,
    private val settingsService: SettingsService,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    private fun debug(out: PrintWriter, text: String) {
        logger.debug(text)
        out.println("Debug: $text")
        out.flush()
    }

    private fun error(out: PrintWriter, text: String, e: Exception) {
        logger.error(text, e)
        out.println("Error: $text")
        out.println("Error: ${e.message}")
        out.flush()
    }

    @PostMapping("/export-categories")
    fun exportCategoriesToWoo(response: HttpServletResponse) {
        response.addHeader("content-type", "text/plain; charset=utf-8")
        response.status = 200

        val out: PrintWriter = response.writer
        debug(out, "Start Export Categories To Woo")

        try {
            val wooCatgs: MutableMap<Long, CategoryWoo> =
                wooService.getCategories().map { it.id to it }.toMap(mutableMapOf())
            debug(out, "Woo has ${wooCatgs.size} categories")

            val allCategories = categoryService.findAll()
            debug(out, "PIM has ${allCategories.size} categories")

            val levelArrays = buildCatgLevelArrays(allCategories, out)

            val locales: List<PimLocale> = settingsService.getPimLocales()
            debug(out, "PIM has ${locales.size} locales: $locales")

            // create/update categories in woo
            debug(out, "create/update categories in woo")
            levelArrays.forEachIndexed { index, catgs ->
                debug(out, "- Level $index...")
                catgs.forEach { c ->
                    debug(out, "-- Handle Category ${c.id}")

                    // find lang that already created in woo
                    // Pair: countryCode to idWoo
                    val createdLang: MutableList<Pair<String, Long>> =
                        c.idWoo.map {
                            val split = it.split("#")
                            return@map split[1] to split[0].toLong()
                        }.toMutableList()

                    debug(out, "-- idWoo of Category ${c.id}: ${c.idWoo}")
                    debug(out, "-- Created Langs In woo: $createdLang")

                    // foreach created lang: update
                    debug(out, "-- Update existing category lang...")
                    createdLang.forEach { pair ->
                        val languageCode = pair.first
                        val wooCatgId = pair.second
                        val locale = locales.first { it.languageCode == languageCode }
                        debug(out, "--- Push PIM category ${c.id} to update Woo Category $wooCatgId with lang $languageCode")

                        // update
                        val updatedCatgWoo =
                            wooService.updateCategory(c, locale, wooCatgId, allCategories, wooCatgs[wooCatgId])

                        // update wooCatgs map with updated catgWoo
                        wooCatgs[updatedCatgWoo.id] = updatedCatgWoo

                        debug(out, "--- Update OK")
                    }

                    // foreach not created lang: create
                    debug(out, "-- Create missing category lang...")
                    locales
                        // find all lang which are not in createdLang
                        .filter { locale ->
                            !createdLang.map(Pair<String, Long>::first).contains(locale.languageCode)
                        }
                        // create the catg woo with this lang
                        .forEach { locale ->
                            debug(out, "--- Push PIM category ${c.id} to create new Woo Category with lang ${locale.languageCode}")

                            // create
                            val createdCatgWoo = wooService.createCategory(c, locale, allCategories)

                            // update all woo catgs map
                            wooCatgs[createdCatgWoo.id] = createdCatgWoo

                            // save the created catgWoo id in catg object
                            val idWoo = "${createdCatgWoo.id}#${locale.languageCode}"
                            c.idWoo.add(idWoo)
                            debug(out, "--- id woo $idWoo added to Category ${c.id}")
                            debug(out, "--- Latest value: ${c.idWoo}")

                            debug(out, "--- Create OK, created woo category with id ${createdCatgWoo.id}")
                        }

                    // save the catg
                    categoryService.save(c)
                    debug(out, "-- Saved PIM Category Object ${c.id}")
                }
                debug(out, "- Level $index end")
            }

            // set the translation attr in woo
            debug(out, "Update translations attributes...")
            allCategories.forEach { c ->
                debug(out, "- Update Category id ${c.id} with idWoo ${c.idWoo}")
                wooService.updateTranslationsAttr(c.idWoo)
            }

            // delete any woo categories which are not in the PIM
            debug(out, "Delete any woo categories which are not in the PIM...")
            val idSet: Set<Long> = allCategories
                .asSequence()
                .map(Category::idWoo)
                .flatten()
                .map { it.split("#")[0].toLong() }
                .toSet()

            wooCatgs.keys
                .filter { !idSet.contains(it) }
                .forEach {
                    debug(out, "- Delete woo category with woo id $it")
                    wooService.deleteCategory(it)
                }
        } catch (e: Exception) {
            error(out, "Export Error", e)
        }


        debug(out, "End Export Categories To Woo")
    }

    @GetMapping("/export-products")
    fun exportProductsToCsv(response: HttpServletResponse): ResponseEntity<String> {
        val csv = wooService.exportProductsToCsv(
            productService.findAll(),
            categoryService.findAll(),
            settingsService.getProductAttributes(),
            settingsService.getPimLocales()
        )

        return if (csv != null && csv.isNotEmpty()) {
            ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${LocalDateTime.now()}.csv\"")
                .body(csv)
        } else {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    private fun buildCatgLevelArrays(catgs: List<Category>, out: PrintWriter): ArrayList<List<Category>> {
        debug(out, "Start buildCatgLevelArrays, size = ${catgs.size}")

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

            debug(out, "Iteration ${arrays.size + 1}: found size = ${found.size}")

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

        debug(out, "End buildCatgLevelArrays, size = ${catgs.size} totalFound = $totalFound")

        return arrays
    }
}
