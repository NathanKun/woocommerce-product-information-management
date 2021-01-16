package com.catprogrammer.pim.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding

@ConstructorBinding
@ConfigurationProperties(prefix = "aws")
data class AwsS3Config(
    val accessKey: String,
    val secretKey: String,
    val bucketName: String
)
