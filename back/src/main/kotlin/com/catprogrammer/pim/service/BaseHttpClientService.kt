package com.catprogrammer.pim.service

import com.catprogrammer.pim.exception.OkHttpRequestFailException
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import okhttp3.OkHttpClient
import okhttp3.Request
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.IOException

open class BaseHttpClientService(
    protected val mapper: ObjectMapper,
    protected val http: OkHttpClient,
) {
    protected open val logger: Logger = LoggerFactory.getLogger(javaClass)

    protected inline fun <reified T> syncRequest(rq: Request): T {
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

                    throw OkHttpRequestFailException(url, "response not successful: code = ${res.code}, body = $body")
                }
            }
        } catch (e: IOException) {
            logger.error("IOException when call url $url")
            throw OkHttpRequestFailException(url, "IOException when call url $url", e)
        }
    }
}
