package com.catprogrammer.pim.dto

import com.catprogrammer.pim.enumeration.AttributeValueType
import com.catprogrammer.pim.enumeration.ProductType

data class NewProductRequest(
    val sku: String,
    val type: ProductType,
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

