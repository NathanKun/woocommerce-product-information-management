package com.catprogrammer.pim.controller

import com.catprogrammer.pim.dto.CategoryWoo
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.service.CategoryService
import com.catprogrammer.pim.service.SettingsService
import com.catprogrammer.pim.service.WooService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RequestMapping("/api/woo")
@RestController
class WooController(
    private val wooService: WooService,
    private val categoryService: CategoryService,
    private val settingsService: SettingsService,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @PostMapping("/test")
    fun exportCategoriesToWoo() {
        logger.debug("Start Export Categories To Woo")

        val wooCatgs: MutableMap<Long, CategoryWoo> =
            wooService.getCategories().map { it.id to it }.toMap(mutableMapOf())
        logger.debug("Woo has ${wooCatgs.size} categories")

        val allCategories = categoryService.findAll()
        logger.debug("PIM has ${allCategories.size} categories")

        val levelArrays = buildCatgLevelArrays(allCategories)

        val locales: List<PimLocale> = settingsService.getPimLocales()
        logger.debug("PIM has ${locales.size} locales: $locales")

        // create/update categories in woo
        logger.debug("create/update categories in woo")
        levelArrays.forEachIndexed { index, catgs ->
            logger.debug("- Level $index...")
            catgs.forEach { c ->
                logger.debug("-- Handle Category ${c.id}")

                // find lang that already created in woo
                // Pair: countryCode to idWoo
                val createdLang: MutableList<Pair<String, Long>> =
                    c.idWoo.map {
                        val split = it.split("#")
                        return@map split[1] to split[0].toLong()
                    }.toMutableList()

                logger.debug("-- idWoo of Category ${c.id}: ${c.idWoo}")
                logger.debug("-- Created Langs In woo: $createdLang")

                // foreach created lang: update
                logger.debug("-- Update existing category lang...")
                createdLang.forEach { pair ->
                    val countryCode = pair.first
                    val wooCatgId = pair.second
                    val locale = locales.first { it.languageCode == countryCode }
                    logger.debug("--- Push PIM category ${c.id} to update Woo Category $wooCatgId with lang $countryCode")

                    // update
                    val updatedCatgWoo =
                        wooService.updateCategory(c, locale, wooCatgId, allCategories, wooCatgs[wooCatgId])

                    // update wooCatgs map with updated catgWoo
                    wooCatgs[updatedCatgWoo.id] = updatedCatgWoo

                    logger.debug("--- Update OK")
                }

                // foreach not created lang: create
                logger.debug("-- Create missing category lang...")
                locales
                    // find all lang which are not in createdLang
                    .filter { locale ->
                        !createdLang.map(Pair<String, Long>::first).contains(locale.languageCode)
                    }
                    // create the catg woo with this lang
                    .forEach { locale ->
                        logger.debug("--- Push PIM category ${c.id} to create new Woo Category with lang ${locale.languageCode}")

                        // create
                        val createdCatgWoo = wooService.createCategory(c, locale, allCategories)

                        // update all woo catgs map
                        wooCatgs[createdCatgWoo.id] = createdCatgWoo

                        // save the created catgWoo id in catg object
                        val idWoo = "${createdCatgWoo.id}#${locale.languageCode}"
                        c.idWoo.add(idWoo)
                        logger.debug("--- id woo $idWoo added to Category ${c.id}")
                        logger.debug("--- Latest value: ${c.idWoo}")

                        logger.debug("--- Create OK, created woo category with id ${createdCatgWoo.id}")
                    }

                // save the catg
                categoryService.save(c)
                logger.debug("-- Saved PIM Category Object ${c.id}")
            }
            logger.debug("- Level $index end")
        }

        // set the translation attr in woo
        logger.debug("Update translations attributes...")
        allCategories.forEach { c ->
            logger.debug("- Update Category id ${c.id} with idWoo ${c.idWoo}")
            wooService.updateTranslationsAttr(c.idWoo)
        }

        // delete any woo categories which are not in the PIM
        logger.debug("Delete any woo categories which are not in the PIM...")
        val idSet: Set<Long> = allCategories
            .asSequence()
            .map(Category::idWoo)
            .flatten()
            .map { it.split("#")[0].toLong() }
            .toSet()

        wooCatgs.keys
            .filter { !idSet.contains(it) }
            .forEach {
                logger.debug("- Delete woo category with woo id $it")
                wooService.deleteCategory(it)
            }

        logger.debug("End Export Categories To Woo")
    }

    private fun buildCatgLevelArrays(catgs: List<Category>): ArrayList<List<Category>> {
        logger.debug("Start buildCatgLevelArrays, size = ${catgs.size}")

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

            logger.debug("Iteration ${arrays.size + 1}: found size = ${found.size}")

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

        logger.debug("End buildCatgLevelArrays, size = ${catgs.size} totalFound = $totalFound")

        return arrays
    }
}
