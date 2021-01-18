package com.catprogrammer.pim.dto

import com.catprogrammer.pim.enumeration.AttributeValueType

data class NewCategoryRequest(
    val code: String,
    val name: String,
    var parentId: Long?,
    var image: String?,
    val attributes: List<NewAttributeValuePair>
) {
    data class NewAttributeValuePair(
        val name: String,
        val value: String,
        val type: AttributeValueType
    )
}

