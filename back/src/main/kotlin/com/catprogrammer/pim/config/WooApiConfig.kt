package com.catprogrammer.pim.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "account.woo")
data class WooApiConfig(
    val key: String,
    val secret: String,
    val basic: Boolean
)
