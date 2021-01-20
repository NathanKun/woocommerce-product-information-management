package com.catprogrammer.pim.dto

import com.catprogrammer.pim.enumeration.AttributeValueType
import com.fasterxml.jackson.annotation.JsonProperty

data class NewCategoryRequest(
    val code: String,
    val name: String,
    var parentId: Long?,
    var image: String?,
    @JsonProperty("menu_order")
    var menuOrder: Int,
    val attributes: List<NewAttributeValuePair>
) {
    data class NewAttributeValuePair(
        val name: String,
        val value: String,
        val type: AttributeValueType
    )
}

