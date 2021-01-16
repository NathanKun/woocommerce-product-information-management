package com.catprogrammer.pim.dto

data class NewCategoryRequest(
    val code: String,
    val name: String,
    var parentId: Long?,
    val attributes: List<NewAttributeValuePair>
) {
    data class NewAttributeValuePair(
        val name: String,
        val value: String
    )
}

