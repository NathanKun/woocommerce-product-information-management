package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.SettingsDto
import com.catprogrammer.pim.entity.CategoryAttribute
import com.catprogrammer.pim.entity.PimLocale
import com.catprogrammer.pim.entity.ProductAttribute
import com.catprogrammer.pim.enumeration.AttributeValueType
import com.catprogrammer.pim.repository.CategoryAttributeRepository
import com.catprogrammer.pim.repository.PimLocaleRepository
import com.catprogrammer.pim.repository.ProductAttributeRepository
import org.springframework.stereotype.Service

@Service
class SettingsService(
    private val categoryAttributeRepository: CategoryAttributeRepository,
    private val productAttributeRepository: ProductAttributeRepository,
    private val pimLocaleRepository: PimLocaleRepository
) {
    fun getSettings(): SettingsDto = SettingsDto(
        categoryAttributeRepository.findAll(),
        productAttributeRepository.findAll(),
        pimLocaleRepository.findAll()
    )

    fun getPimLocales(): List<PimLocale> = pimLocaleRepository.findAll()

    fun addCategoryAttribute(name: String, localizable: Boolean, valueType: AttributeValueType, description: String) =
        categoryAttributeRepository.save(CategoryAttribute(name, localizable, valueType, description))

    fun addProductAttribute(name: String, localizable: Boolean, valueType: AttributeValueType, variation: Boolean, description: String) =
        productAttributeRepository.save(ProductAttribute(name, localizable, valueType, variation, description))

    fun deleteCategoryAttribute(id: Long) = categoryAttributeRepository.deleteById(id)

    fun deleteProductAttribute(id: Long) = productAttributeRepository.deleteById(id)

    fun addPimLocale(name: String, languageCode: String, countryCode: String) =
        pimLocaleRepository.save(PimLocale(name, languageCode, countryCode))

    fun deletePimLocale(id: Long) = pimLocaleRepository.deleteById(id)
}
