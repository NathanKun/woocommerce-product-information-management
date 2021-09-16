package com.catprogrammer.pim.dto

import com.catprogrammer.pim.entity.AttributeValuePair
import com.catprogrammer.pim.entity.VariationConfiguration
import com.catprogrammer.pim.enumeration.ProductType

data class NewProductRequest(
    val type: ProductType,
    val parent: String?,
    val name: String,
    var image: String?,
    var menuOrder: Int,
    val categoryIds: Set<Long>,
    val attributes: List<AttributeValuePair>,
    var variationConfigurations: List<VariationConfiguration>?
)
