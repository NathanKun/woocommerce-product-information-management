package com.catprogrammer.pim.dto

import com.catprogrammer.pim.enumeration.AttributeValueType

data class AttributeRequest(
    val name: String,
    val localizable: Boolean,
    val valueType: AttributeValueType,
    val variation: Boolean?,
    val description: String,
    val options: List<String>
)
