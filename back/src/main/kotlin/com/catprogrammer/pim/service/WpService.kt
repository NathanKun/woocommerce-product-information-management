package com.catprogrammer.pim.service

import com.catprogrammer.pim.config.WpApiConfig
import com.catprogrammer.pim.dto.WpMediaResponse
import com.fasterxml.jackson.databind.ObjectMapper
import okhttp3.Headers
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class WpService(
    @Qualifier("CustomObjectMapper") mapper: ObjectMapper,
    @Qualifier("WpOkHttpClient") http: OkHttpClient,
    wpApiConfig: WpApiConfig,
): BaseHttpClientService(mapper, http) {
    override val logger: Logger = LoggerFactory.getLogger(javaClass)

    private val server = wpApiConfig.server
    private val baseWpUrl = "$server/wp-json/wp/v2"
    private val mediaUrl = "$baseWpUrl/media"

    fun uploadMedia(file: MultipartFile, name: String): WpMediaResponse {
        logger.info("Upload file to WP - name = $name - url = $mediaUrl")
        val rq = Request.Builder()
            .url(mediaUrl)
            .post(file.bytes.toRequestBody())
            .headers(Headers.headersOf("Content-Disposition", "attachment; filename=\"$name\""))
            .build()

        return syncRequest(rq)
    }
}
