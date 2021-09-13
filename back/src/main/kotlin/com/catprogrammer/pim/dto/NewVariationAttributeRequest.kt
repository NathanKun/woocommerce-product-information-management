package com.catprogrammer.pim.dto

data class NewVariationAttributeRequest(
    val name: String,
    val terms: List<NewVariationAttributeTerm>
) {
    data class NewVariationAttributeTerm(
        val name: String,
        val translations: Set<NewVariationAttributeTermTranslation>,
    )

    data class NewVariationAttributeTermTranslation(
        val lang: String,
        val translation: String,
    )
}
