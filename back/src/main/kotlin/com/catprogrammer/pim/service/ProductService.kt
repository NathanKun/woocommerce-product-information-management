package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.NewProductRequest
import com.catprogrammer.pim.entity.AttributeValuePair
import com.catprogrammer.pim.entity.Product
import com.catprogrammer.pim.repository.ProductRepository
import org.springframework.stereotype.Service

@Service
class ProductService(private val productRepository: ProductRepository) {
    fun findById(id: Long): Product? = productRepository.findById(id).orElse(null)

    fun findAll(): List<Product> = productRepository.findAll()

    fun save(pdt: Product) = productRepository.save(pdt)

    fun save(pdt: NewProductRequest): Product {
        val attributes = pdt.attributes.map { AttributeValuePair(it.name, it.value) }
        return save(
            Product(
                pdt.sku,
                pdt.type,
                pdt.parent,
                pdt.name,
                pdt.image,
                pdt.menuOrder,
                pdt.categoryIds,
                attributes,
                pdt.variationConfigurations,
            )
        )
    }

    fun delete(id: Long) = productRepository.deleteById(id)

    fun delete(pdt: Product) = productRepository.delete(pdt)
}
