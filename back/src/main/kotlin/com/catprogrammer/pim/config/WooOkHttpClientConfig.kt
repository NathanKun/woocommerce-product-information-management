package com.catprogrammer.pim.config

import okhttp3.Credentials
import okhttp3.OkHttpClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.concurrent.TimeUnit


@Configuration
class WooOkHttpClientConfig(
    private val wooApiConfig: WooApiConfig
) {

    @Bean(name = ["WooOkHttpClient"])
    fun okHttpClient(): OkHttpClient {
        val builder = OkHttpClient.Builder()

        // add basic auth header
        builder.addInterceptor { chain ->
            val credential: String = Credentials.basic(wooApiConfig.key, wooApiConfig.secret)
            val request = chain.request().newBuilder()
                .addHeader("Authorization", credential)
                .build()
            return@addInterceptor chain.proceed(request)
        }

        builder
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)

        return builder.build()
    }
}
