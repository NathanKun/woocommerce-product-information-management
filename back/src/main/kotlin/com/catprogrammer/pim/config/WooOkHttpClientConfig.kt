package com.catprogrammer.pim.config

import okhttp3.*
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.net.InetSocketAddress
import java.net.Proxy
import java.util.concurrent.TimeUnit


@Configuration
class WooOkHttpClientConfig(
    private val wooApiConfig: WooApiConfig,
    private val proxyConfig: ProxyConfig?
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
