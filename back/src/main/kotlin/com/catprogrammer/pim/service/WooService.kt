package com.catprogrammer.pim.service

import com.catprogrammer.pim.config.WooApiConfig
import com.catprogrammer.pim.dto.*
import com.catprogrammer.pim.entity.*
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.enumeration.ProductType
import com.catprogrammer.pim.exception.OkHttpRequestFailException
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.type.TypeFactory
import com.fasterxml.jackson.module.kotlin.readValue
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import java.io.IOException

@Service
class WooService(
    @Qualifier("CustomObjectMapper") private val mapper: ObjectMapper,
    private val http: OkHttpClient,
    wooApiConfig: WooApiConfig,
) {
    private val logger = LoggerFactory.getLogger(javaClass)


    private val server = wooApiConfig.server
    private val baseUrl = "$server/wp-json/wc/v3"

    val categoriesUrl = "$baseUrl/products/categories"
    val productsUrl = "$baseUrl/products"
    val productAttributesUrl = "$baseUrl/products/attributes"

    private val jsonMediaType: MediaType = "application/json; charset=utf-8".toMediaTypeOrNull()!!

    private val csvSeparator = ";"

    fun getCategories(): List<CategoryWoo> {
        val perPageSize = 100
        val url = "$categoriesUrl?per_page=$perPageSize"

        var hasMore = true
        var page = 1
        val list = ArrayList<CategoryWoo>()

        while (hasMore) {
            logger.debug("getCategories - url = $url&page=$page")
            val res = syncRequest<List<CategoryWoo>>(
                Request.Builder()
                    .url("$url&page=$page")
                    .get()
                    .build()
            )
            list.addAll(res)

            hasMore = res.size == perPageSize
            page++
        }

        return list
    }

    fun updateCategory(
        c: Category,
        locale: PimLocale,
        idWoo: Long,
        catgs: List<Category>,
        cWoo: CategoryWoo?
    ): CategoryWoo {
        val url = "$categoriesUrl/${idWoo}"
        logger.debug("updateCategory - url = $url")

        val data = mapper.writeValueAsString(mapCategoryToCategoryWoo(c, locale, catgs, cWoo))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(url)
                .put(data.toRequestBody(jsonMediaType))
                .build()
        )
    }

    fun createCategory(c: Category, locale: PimLocale, catgs: List<Category>): CategoryWoo {
        val url = categoriesUrl
        logger.debug("createCategory - url = $url")

        val data = mapper.writeValueAsString(mapCategoryToCategoryWoo(c, locale, catgs, null))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(url)
                .post(data.toRequestBody(jsonMediaType))
                .build()
        )
    }

    fun deleteCategory(id: Long) {
        val url = "$categoriesUrl/${id}?force=true"
        logger.debug("deleteCategory - url = $url")

        /*return syncRequest(
            Request.Builder()
                .url(url)
                .delete()
                .build()
        )*/
    }

    fun updateCategoryMenuOrder(c: Category, menuOrder: Long): Long {
        var order = menuOrder

        c.idWoo.sortedBy { it.split("#")[1] }.forEach { idWithLang ->
            val id = idWithLang.split("#")[0]
            val url = "$categoriesUrl/$id"
            logger.debug("updateCategoryMenuOrder - url = $url")

            val data = mapper.writeValueAsString(MenuOrderWooRequest(id.toLong(), order))
            logger.debug("data = $data")

            order++

            return@forEach syncRequest(
                Request.Builder()
                    .url(url)
                    .post(data.toRequestBody(jsonMediaType))
                    .build()
            )
        }

        return order
    }

    /**
     * id in format ID#LANG_CODE, ex: 233#fr
     */
    fun updateTranslationsAttr(idWoo: Set<String>, baseUrl: String) { // [${idWoo}#${languageCode}, ...]
        val id = idWoo.first().split("#").first()
        val translations = mapper.createObjectNode()
        idWoo.forEach {
            val split = it.split("#")
            translations.put(split[1], split[0].toLong())
        }

        val data = mapper.createObjectNode()
        data.put("id", id)
        data.replace("translations", translations)
        val dataStr = mapper.writeValueAsString(data)

        val url = "$baseUrl/$id"
        logger.debug("updateTranslationsAttr - url = $url")
        logger.debug("data = $dataStr")

        return syncRequest(
            Request.Builder()
                .url(url)
                .put(dataStr.toRequestBody(jsonMediaType))
                .build()
        )
    }

    fun exportProductsToCsv(
        products: List<Product>,
        categories: List<Category>,
        productAttributes: List<ProductAttribute>,
        variationAttributes: List<VariationAttribute>,
        pimLocales: List<PimLocale>
    ): String? {
        logger.info("Export Products To CSV start")

        val categoriesMap =
            categories.associateBy { it.id } // simplification of 'categories.map { it.id to it }.toMap()'

        // find max variation attributes count
        val variationAttributesCount = products.maxOf { p -> p.variationConfigurations?.size ?: 0 }

        // build variation attributes headers
        val variationAttributesHeaders = mutableListOf<String>()
        if (variationAttributesCount > 0) {
            for (i in 1..variationAttributesCount) {
                variationAttributesHeaders.add("Attribute $i name")
                variationAttributesHeaders.add("Attribute $i value(s)")
                variationAttributesHeaders.add("Attribute $i visible")
                variationAttributesHeaders.add("Attribute $i global")
            }
        }

        // meta headers
        val metaHeaders = listOf("Meta: _internal_name")

        val table = ArrayList<List<String>>()
        val headers = listOf(
            "Type", "Parent", "SKU", "Language", "Translation group", "Position"/* menu_order */, "Categories",
            *productAttributes.map(ProductAttribute::name).toTypedArray(),
            *variationAttributesHeaders.toTypedArray(),
            *metaHeaders.toTypedArray()
        )
        table.add(headers)

        logger.debug("Headers length = ${headers.size}")
        logger.debug(headers.toString())

        var error = false

        for (pdt in products) {
            if (error) {
                break
            }

            logger.info("Processing product id = ${pdt.id} name = ${pdt.name} ...")

            val attrMap = pdt.attributes.associateBy { it.name } // = pdt.attributes.map { it.name to it }.toMap()
            for (locale in pimLocales) {
                logger.info("locale ${locale.languageCode} ${locale.countryCode}")

                // fix attrs
                val parent = if (pdt.type == ProductType.Variation) pdt.parent!! else ""
                val row = mutableListOf(
                    pdt.type.name,              // Type
                    parent,                     // Parent
                    pdt.sku,                    // SKU
                    locale.languageCode,        // Language
                    pdt.sku,                    // Translation group
                    pdt.menuOrder.toString()    // Position
                )

                // categories attr
                row.add(escape(categoriesIdSetToCsvValue(pdt.categoryIds, categoriesMap, locale)))

                // variable attrs
                val attrs = productAttributes.map {
                    val key = if (it.localizable) {
                        "${it.name}#${locale.languageCode}"
                    } else {
                        it.name
                    }

                    var value = attrMap[key]?.value ?: ""
                    if (value.isEmpty()) {
                        logger.warn("Attribute $key not found on product id = ${pdt.id} name = ${pdt.name}")
                    }

                    if (it.name == "Images") {
                        if (value.isNotEmpty()) {
                            logger.warn(value)
                            val imgArray: MutableList<String> = mapper.readValue(
                                value,
                                TypeFactory.defaultInstance().constructCollectionType(
                                    MutableList::class.java,
                                    String::class.java
                                )
                            )

                            // add pdt.image as the first image in Images attr
                            val firstImage = pdt.image
                            if (firstImage != null && firstImage.isNotEmpty()) {
                                imgArray.add(firstImage)
                            }

                            value = imgArray.joinToString(",")
                        }
                    }

                    // if pdt name is empty, give a meaningful default name, otherwise WP will set a not meaningful placeholder name
                    if (it.name == "Name" && value.isEmpty()) {
                        value = "${pdt.name}#${locale.name}"
                    }

                    // if pdt type is Variation and attr is Published, must set Published to 1 (published), otherwise the variation is hidden in wp-admin
                    if (pdt.type == ProductType.Variation && it.name == "Published") {
                        value = "1"
                    }

                    // if value contains the csv separator,  wrap the value with ""
                    value = escape(value)

                    return@map value
                }
                row.addAll(attrs)

                // variable attributes
                if (variationAttributesCount > 0) {
                    val variableAttributesCells = mutableListOf<String>()
                    val varConfs = pdt.variationConfigurations
                    for (i in 1..variationAttributesCount) {
                        if (varConfs != null && varConfs.size >= i) {
                            // Attribute n name
                            val pdtAttributeName = varConfs[i - 1].attributeName
                            variableAttributesCells.add(pdtAttributeName)

                            // Attribute n value(s)
                            try {
                                // find the translated terms
                                val pdtAttributeValues =
                                    varConfs[i - 1].attributeValues // list of VariationAttributeTerm.name
                                val varAttSetting = variationAttributes.firstOrNull { it.name == pdtAttributeName }
                                    ?: throw NoSuchElementException("VariationAttribute with name '$pdtAttributeName' not found")
                                val translatedValues = pdtAttributeValues.map { pdtAttributeValue ->
                                    val matchNameTerm = varAttSetting.terms.firstOrNull { term ->
                                        term.name == pdtAttributeValue
                                    }
                                        ?: throw NoSuchElementException("VariationAttributeTerm '$pdtAttributeValue' not found in VariationAttribute '$pdtAttributeName'")
                                    val translation = matchNameTerm.translations.firstOrNull { tr ->
                                        tr.lang == locale.languageCode
                                    }
                                        ?: throw NoSuchElementException("languageCode '${locale.languageCode}' not found in VariationAttributeTerm '$pdtAttributeValue' in VariationAttribute '$pdtAttributeName'")
                                    return@map translation.translation
                                }

                                val translatedValuesCell = escape(translatedValues.joinToString(", "))

                                variableAttributesCells.add(translatedValuesCell)

                                variableAttributesCells.add("1") // Attribute n visible
                                variableAttributesCells.add("1") // Attribute n global
                            } catch (e: NoSuchElementException) {
                                error = true
                                logger.error("Export Variable Attributes of product ${pdt.name} of locale ${locale.name} error: ${e.message}")
                                variableAttributesCells.removeLast()
                                variableAttributesCells.addAll(listOf("", "", "", ""))
                            }
                        } else {
                            variableAttributesCells.addAll(listOf("", "", "", ""))
                        }
                    }

                    row.addAll(variableAttributesCells)
                } // variable attributes end

                // meta
                row.add(escape(pdt.name))

                if (row.size != headers.size) {
                    logger.error("row size ${row.size} != headers size ${headers.size}")
                    logger.error(headers.toString())
                    logger.error(row.toString())
                    error = true
                    break
                }

                table.add(row)
            }
        }

        if (error) {
            logger.error("Export Products To CSV stopped because of error")
            return null
        }

        val csv = table.joinToString("\n") { row ->
            row.joinToString(csvSeparator)
        }

        logger.info("Export Products To CSV end")

        return csv
    }

    fun getProductAttributes(): List<ProductAttributeWoo> {
        logger.debug("getProductAttributes - url = $productAttributesUrl")
        return syncRequest(
            Request.Builder()
                .url(productAttributesUrl)
                .get()
                .build()
        )
    }

    fun createProductAttribute(attr: VariationAttribute): ProductAttributeWoo {
        logger.debug("createProductAttribute - url = $productAttributesUrl")

        val data = mapper.writeValueAsString(ProductAttributeWooRequest(attr.name))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(productAttributesUrl)
                .post(data.toRequestBody(jsonMediaType))
                .build()
        )
    }


    fun getProductAttributeTermsUrl(productAttributeId: Long) =
        "$productAttributesUrl/$productAttributeId/terms"

    fun getProductAttributeTerms(productAttributeWooId: Long): List<ProductAttributeTermWoo> {
        val perPageSize = 100
        var hasMore = true
        var page = 1
        val list = mutableListOf<ProductAttributeTermWoo>()

        while (hasMore) {
            val url = getProductAttributeTermsUrl(productAttributeWooId) + "?per_page=$perPageSize&page=$page"
            logger.debug("getProductAttributeTerms - url = $url")
            val res = syncRequest<List<ProductAttributeTermWoo>>(
                Request.Builder()
                    .url(url)
                    .get()
                    .build()
            )

            list.addAll(res)

            hasMore = res.size == perPageSize
            page++
        }

        return list
    }

    fun createProductAttributeTerm(
        productAttributeWooId: Long,
        term: String,
        lang: String,
        description: String,
        menuOrder: Long
    ): ProductAttributeTermWoo {
        val url = getProductAttributeTermsUrl(productAttributeWooId)
        logger.debug("createProductAttributeTerm - url = $url")

        val data =
            mapper.writeValueAsString(ProductAttributeTermWooRequest(term, lang, description, "$term-$lang", menuOrder))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(url)
                .post(data.toRequestBody(jsonMediaType))
                .build()
        )
    }

    fun updateProductAttributeTerm(
        productAttributeWooId: Long,
        productAttributeTermWooId: Long,
        text: String,
        menuOrder: Long
    ): ProductAttributeTermWoo {
        val url = "${getProductAttributeTermsUrl(productAttributeWooId)}/$productAttributeTermWooId"
        logger.debug("updateProductAttributeTerm - url = $url")

        val data = mapper.writeValueAsString(ProductAttributeTermWooRequest(text, null, null, null, menuOrder))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(url)
                .post(data.toRequestBody(jsonMediaType))
                .build()
        )
    }

    fun getProduct(sku: String): List<ProductWoo> {
        val url = "$productsUrl/?sku=$sku"
        logger.debug("getProduct - url = $url")

        return syncRequest(
            Request.Builder()
                .url(url)
                .get()
                .build()
        )
    }

    fun setProductStock(idWoo: Long, stock: Int): ProductWoo {
        val url = "$productsUrl/$idWoo"
        logger.debug("setProductStock - url = $url")

        val data = mapper.writeValueAsString(UpdateWooProductStockRequest(idWoo, stock, true))
        logger.debug("data = $data")

        return syncRequest(
            Request.Builder()
                .url(url)
                .post(data.toRequestBody(jsonMediaType))
                .build()
        )
    }

    private fun escape(value: String): String {
        val quoteEscaped = value.replace("\"", "\"\"")

        if (quoteEscaped.contains(csvSeparator)) {
            return "\"$quoteEscaped\""
        }
        return quoteEscaped
    }

    private fun categoriesIdSetToCsvValue(ids: Set<Long>, categories: Map<Long, Category>, locale: PimLocale): String {
        val list = ids.map { id ->
            val catg = categories[id]
            if (catg == null) {
                logger.error("Category id $id not found")
                return@map ""
            }

            return@map buildCategoryNameString(catg, categories, locale)
        }.toMutableList()

        list.add("ALL#${locale.name}")

        return list.joinToString(",")
    }

    private fun buildCategoryNameString(catg: Category, categories: Map<Long, Category>, locale: PimLocale): String? {
        val catgName =
            catg.attributes.firstOrNull { attr -> attr.name == "name" || attr.name == "name#${locale.languageCode}" }
                ?: return null

        if (catg.parentId != null) {
            val parentCatg = categories[catg.parentId]
            if (parentCatg != null) {
                val parentStr = buildCategoryNameString(parentCatg, categories, locale)
                return "$parentStr > ${catgName.value}"
            }
        }

        return catgName.value
    }

    private fun mapCategoryToCategoryWoo(
        c: Category,
        locale: PimLocale,
        catgs: List<Category>,
        cWoo: CategoryWoo?
    ): CategoryWooRequest {
        val languageCode = locale.languageCode

        val image = if (c.image != null) {
            val oldFileName = cWoo?.image?.src?.split("/")?.last()
            val newFileName = c.image!!.split("/").last()

            // image not changed
            if (oldFileName == newFileName) {
                ImageRequest(id = cWoo.image.id, null, null, null)
            }
            // image changed
            else {
                ImageRequest(id = null, src = c.image!!, null, null)
            }
        }
        // no image in pim
        else {
            ImageRequest(null, "", null, null)
        }

        return CategoryWooRequest(
            getVariableAttrValue(c, locale, "name"),
            getVariableAttrValue(c, locale, "slug"),
            catgs.firstOrNull { it.id == c.parentId }?.idWoo?.firstOrNull { it.split("#")[1] == languageCode }
                ?.split("#")
                ?.get(0)?.toLong(),
            getVariableAttrValue(c, locale, "description"),
            image,
            languageCode,
        )
    }

    private fun getVariableAttrValue(c: Category, locale: PimLocale, attr: String): String {
        return c.attributes.firstOrNull { it.name == attr || it.name == "${attr}#${locale.languageCode}" }?.value
            ?: if (attr == "name") {
                "${c.name}#${locale.name}"
            } else {
                "${attr}-attr-not-found-in-pim-${System.currentTimeMillis()}"
            }
    }

    private inline fun <reified T> syncRequest(rq: Request): T {
        val url = rq.url.toString()
        try {
            http.newCall(rq).execute().use { res ->
                return if (res.isSuccessful) {
                    val body = res.body!!.string()
                    mapper.readValue(body)
                } else {
                    val body = res.body?.string()

                    logger.error("response not successful on url $url, code = ${res.code}, body = ")
                    logger.error(body)

                    throw OkHttpRequestFailException(url, "responde not successful: code = ${res.code}, body = $body")
                }
            }
        } catch (e: IOException) {
            logger.error("IOException when call url $url")
            throw OkHttpRequestFailException(url, "IOException when call url $url", e)
        }
    }
}
