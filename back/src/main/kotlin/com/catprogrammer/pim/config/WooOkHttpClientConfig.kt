package com.catprogrammer.pim.config

import okhttp3.*
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import se.akerfeldt.okhttp.signpost.OkHttpOAuthConsumer
import se.akerfeldt.okhttp.signpost.SigningInterceptor
import java.net.InetSocketAddress
import java.net.Proxy
import java.util.*
import java.util.concurrent.TimeUnit


@Configuration
class WooOkHttpClientConfig(
    private val wpApiConfig: WpApiConfig,
    private val wooApiConfig: WooApiConfig,
    private val proxyConfig: ProxyConfig?
) {
    @Bean(name = ["WpOkHttpClient"])
    fun wpClient(): OkHttpClient = okHttpClient(wpApiConfig.user, wpApiConfig.appPassword)

    @Bean(name = ["WooOkHttpClient"])
    fun wooClient(): OkHttpClient = okHttpClient(wooApiConfig.key, wooApiConfig.secret)

    private fun okHttpClient(user: String, password: String): OkHttpClient {
        val builder = OkHttpClient.Builder()

        if (wooApiConfig.basic) {
            // add basic auth header (https)
            builder.addInterceptor { chain ->
                val credential: String = Credentials.basic(user, password)
                val request = chain.request().newBuilder()
                    .addHeader("Authorization", credential)
                    .build()
                return@addInterceptor chain.proceed(request)
            }
        } else {
            // oauth (http)
            val consumer = OkHttpOAuthConsumer(wooApiConfig.key, wooApiConfig.secret)
            builder.addInterceptor(SigningInterceptor(consumer))
        }

        builder
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)

        if (proxyConfig != null && proxyConfig.enabled) {
            val proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress(proxyConfig.host, proxyConfig.port))
            val proxyAuthenticator = Authenticator { _, response ->
                val credential = Credentials.basic(proxyConfig.user, proxyConfig.password)
                response.request.newBuilder()
                    .header("Proxy-Authorization", credential)
                    .build()
            }
            builder.proxy(proxy)
                .proxyAuthenticator(proxyAuthenticator)
        }

        return builder.build()
    }
}
