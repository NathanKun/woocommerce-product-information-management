package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.NewVariationAttributeRequest
import com.catprogrammer.pim.entity.VariationAttribute
import com.catprogrammer.pim.entity.VariationAttributeTerm
import com.catprogrammer.pim.entity.VariationAttributeTermTranslation
import com.catprogrammer.pim.repository.VariationAttributeRepository
import org.springframework.stereotype.Service

@Service
class VariationAttributeService(
    private val variationAttributeRepository: VariationAttributeRepository
) {
    fun findById(id: Long): VariationAttribute? = variationAttributeRepository.findById(id).orElse(null)

    fun findAll(): List<VariationAttribute> = variationAttributeRepository.findAll()

    fun save(attr: VariationAttribute) = variationAttributeRepository.save(attr)

    fun save(attr: NewVariationAttributeRequest): VariationAttribute {
        val terms = attr.terms.map {term ->
            val translations = term.translations.map { tr ->
                VariationAttributeTermTranslation(tr.lang, tr.translation)
            }.toSet()
            VariationAttributeTerm(term.name, translations)
        }
        return save(
            VariationAttribute(
                attr.name,
                terms
            )
        )
    }

    fun delete(id: Long) = variationAttributeRepository.deleteById(id)

    fun delete(attr: VariationAttribute) = variationAttributeRepository.delete(attr)
}
