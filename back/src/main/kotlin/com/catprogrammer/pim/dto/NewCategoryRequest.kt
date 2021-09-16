package com.catprogrammer.pim.dto


data class NewCategoryRequest(
    val code: String,
    val name: String,
    var parentId: Long?,
    var image: String?,
    var menuOrder: Int,
    val attributes: List<NewAttributeValuePair>,
    val ean: String,
) {
    data class NewAttributeValuePair(
        val name: String,
        val value: String,
    )
}

