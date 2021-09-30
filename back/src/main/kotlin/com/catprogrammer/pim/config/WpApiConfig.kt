package com.catprogrammer.pim.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "account.wp")
data class WpApiConfig(
    val server: String,
    val appPassword: String,
    val user: String,
)
