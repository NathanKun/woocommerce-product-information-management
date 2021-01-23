package com.catprogrammer.pim.dto

import com.catprogrammer.pim.enumeration.AttributeValueType

data class NewProductRequest(
    val sku: String,
    val name: String,
    var image: String?,
    var menuOrder: Int,
    val categoryIds: Set<Long>,
    val attributes: List<NewAttributeValuePair>
) {
    data class NewAttributeValuePair(
        val name: String,
        val value: String,
        val type: AttributeValueType
    )
}

