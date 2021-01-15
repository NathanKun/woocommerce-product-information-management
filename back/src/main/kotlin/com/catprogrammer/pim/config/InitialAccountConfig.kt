package com.catprogrammer.pim.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "account.admin")
data class InitialAccountConfig(
    val username: String,
    val password: String,
    val email: String
)
