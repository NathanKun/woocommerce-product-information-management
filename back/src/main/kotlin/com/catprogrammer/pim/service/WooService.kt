package com.catprogrammer.pim.service

import com.catprogrammer.pim.config.WooApiConfig
import com.catprogrammer.pim.dto.CategoryWoo
import com.catprogrammer.pim.dto.CategoryWooRequest
import com.catprogrammer.pim.dto.ImageRequest
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.exception.OkHttpRequestFailException
import com.fasterxml.jackson.databind.ObjectMapper
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
    private val categoriesUrl = "$baseUrl/products/categories"

    private val jsonMediaType: MediaType = "application/json; charset=utf-8".toMediaTypeOrNull()!!

    fun getCategories(): List<CategoryWoo> {
        val url = categoriesUrl
        logger.debug("getCategories - url = $url")

        return syncRequest(
            Request.Builder()
                .url(url)
                .get()
                .build()
        )
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

    fun updateTranslationsAttr(idWoo: Set<String>) { // [${idWoo}#${countryCode}, ...]
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

        val url = "$categoriesUrl/$id"
        logger.debug("updateTranslationsAttr - url = $url")
        logger.debug("data = $dataStr")

        return syncRequest(
            Request.Builder()
                .url(url)
                .put(dataStr.toRequestBody(jsonMediaType))
                .build()
        )
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
            catgs.firstOrNull { it.id == c.id }?.idWoo?.firstOrNull { it.split("#")[1] == languageCode }?.split("#")
                ?.get(0)?.toLong(),
            getVariableAttrValue(c, locale, "description"),
            image,
            c.menuOrder.toLong(),
            languageCode,
        )
    }

    private fun getVariableAttrValue(c: Category, locale: PimLocale, attr: String): String {
        /**
         * !!!
         * Front end uses country code for attr name, ex: attr#gb
         * So here we should use country code to retrieve the attr
         * !!!
         */
        return c.attributes.firstOrNull { it.name == attr || it.name == "${attr}#${locale.countryCode}" }?.value
            ?: "${attr}-attr-not-found-in-pim-${System.currentTimeMillis()}"
    }

    private inline fun <reified T> syncRequest(rq: Request): T {
        val url = rq.url.toString()
        try {
            http.newCall(rq).execute().use { res ->
                if (res.isSuccessful) {
                    return mapper.readValue(res.body!!.byteStream())
                } else {
                    val body = res.body?.string()

                    logger.error("response not successful on url $url, code = ${res.code}, body = ")
                    logger.error(body)

                    throw OkHttpRequestFailException(url, "responde not successful: code = ${res.code}, body = $body")
                }
            }
        } catch (e: IOException) {
            logger.error("IOException when getCategories call url $categoriesUrl")
            throw OkHttpRequestFailException(url, "IOException when getCategories", e)
        }
    }
}
