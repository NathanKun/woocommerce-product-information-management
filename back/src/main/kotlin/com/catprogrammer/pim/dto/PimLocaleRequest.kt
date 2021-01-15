package com.catprogrammer.pim.dto

data class PimLocaleRequest(
    val name: String,
    val languageCode: String,
    val countryCode: String
)
