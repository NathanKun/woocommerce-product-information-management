package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.NewProductRequest
import com.catprogrammer.pim.entity.AttributeValuePair
import com.catprogrammer.pim.entity.Product
import com.catprogrammer.pim.exception.Ean13GenerationException
import com.catprogrammer.pim.repository.ProductRepository
import com.catprogrammer.pim.tool.Ean13Tool
import org.springframework.stereotype.Service
import java.time.OffsetDateTime

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val categoryService: CategoryService,
    private val nextEanService: NextEanService
) {
    private val eanPrefix = "020"

    fun findById(id: Long): Product? = productRepository.findById(id).orElse(null)

    fun findBySku(sku: String): Product? = productRepository.findBySku(sku)

    fun findAllNotDeleted(): List<Product> = productRepository.findByDeletedAtIsNull()

    fun findAllDeleted(): List<Product> = productRepository.findByDeletedAtIsNotNull()

    fun save(pdt: Product) = productRepository.save(pdt)

    fun save(pdt: NewProductRequest): Product {
        val ean13 = if (pdt.sku == null) {
            val catgEan = if (pdt.categoryIds.isNotEmpty()) {
                var maxDepth = 0
                var maxDepthCategory = pdt.categoryIds.first()
                pdt.categoryIds.forEach {
                    var depth = 0
                    var catg = categoryService.findById(it)!!
                    while (catg.parentId != null) {
                        catg = categoryService.findById(catg.parentId!!)!!
                        depth++
                    }

                    if (depth > maxDepth) {
                        maxDepth = depth
                        maxDepthCategory = it
                    }
                }

                categoryService.findById(maxDepthCategory)!!.ean
            } else {
                "00000"
            }

            val pdtEan = nextEanService.next(catgEan)

            var ean12 = "$eanPrefix$catgEan$pdtEan"
            var ean13 = "$ean12${Ean13Tool.getCheckSum(ean12)}"

            var eanCheckOK: Boolean
            do {
                if (productRepository.findBySku(ean13) == null) {
                    eanCheckOK = true
                } else {
                    eanCheckOK = false
                    val nextPrefix = Ean13Tool.increment(eanPrefix)

                    if (nextPrefix.toInt() > 28) {
                        throw Ean13GenerationException("Failed to generate EAN13 for Category EAN $catgEan and Product EAN $pdtEan")
                    }

                    ean12 = "$nextPrefix$catgEan$pdtEan"
                    ean13 = "$ean12${Ean13Tool.getCheckSum(ean12)}"
                }
            } while (!eanCheckOK)

            ean13
        } else {
            pdt.sku.toString()
        }

        val attributes = pdt.attributes.map { AttributeValuePair(it.name, it.value) }
        return save(
            Product(
                ean13,
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

    fun delete(id: Long, softDelete: Boolean = true) {
        if (softDelete) {
            val pdt = productRepository.getById(id)
            pdt.deletedAt = OffsetDateTime.now()
            productRepository.save(pdt)
        } else {
            productRepository.deleteById(id)
        }
    }

    fun delete(pdt: Product, softDelete: Boolean = true) {
        if (softDelete) {
            pdt.deletedAt = OffsetDateTime.now()
            productRepository.save(pdt)
        } else {
            productRepository.delete(pdt)
        }
    }

    fun undelete(id: Long) {
        val pdt = productRepository.getById(id)
        pdt.deletedAt = null
        productRepository.save(pdt)
    }

    fun findAllByCategoryId(catgId: Long, all: List<Product>? = null): List<Product> {
        val catg = categoryService.findById(catgId) ?: return emptyList()
        val allProducts = all ?: findAllNotDeleted()
        val children = categoryService.findChildren(catg).map { c -> c.id }
        return allProducts.filter { p ->
            p.categoryIds.contains(catgId) || p.categoryIds.any { cId ->
                children.contains(
                    cId
                )
            }
        }
    }

    fun getUpdatedProductSince(date: OffsetDateTime) = productRepository.findByUpdatedAtIsGreaterThan(date)
}
