package com.catprogrammer.pim.dto

import com.catprogrammer.pim.entity.CategoryAttribute
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.entity.ProductAttribute

data class SettingsDto(
    val categoryAttributes: List<CategoryAttribute>,
    val productAttributes: List<ProductAttribute>,
    val pimLocales: List<PimLocale>
)
