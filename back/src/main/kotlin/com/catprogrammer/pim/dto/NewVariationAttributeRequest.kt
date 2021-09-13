package com.catprogrammer.pim.dto

data class NewVariationAttributeRequest(
    val name: String,
    val terms: List<NewVariationAttribute>
) {
    data class NewVariationAttribute(
        val name: String,
        val lang: String,
    )
}
