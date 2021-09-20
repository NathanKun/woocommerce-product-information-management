package com.catprogrammer.pim.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "account.proxy")
data class ProxyConfig(
    val enabled: Boolean = false,
    val host: String = "",
    val port: Int = -1,
    val user: String = "",
    val password: String = "",
)
