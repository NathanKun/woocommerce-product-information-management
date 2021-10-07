package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.NewCategoryRequest
import com.catprogrammer.pim.entity.AttributeValuePair
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(private val categoryRepository: CategoryRepository) {
    fun findById(id: Long): Category? = categoryRepository.findById(id).orElse(null)

    fun findAll(): List<Category> = categoryRepository.findAll()

    fun save(category: Category) = categoryRepository.save(category)

    fun save(category: NewCategoryRequest): Category {
        val attributes = category.attributes.map { AttributeValuePair(it.name, it.value) }
        return save(
            Category(
                category.code,
                category.name,
                category.parentId,
                category.image,
                category.menuOrder,
                attributes,
                category.ean
            )
        )
    }

    fun delete(id: Long) = categoryRepository.deleteById(id)

    fun delete(category: Category) = categoryRepository.delete(category)

    fun findChildren(parent: Category, result: MutableList<Category>? = null, all: List<Category>? = null): List<Category> {
        val resultList = result ?: mutableListOf()
        val allCategory = all ?: findAll()

        val children = allCategory.filter { c -> c.parentId == parent.id }

        if (children.isNotEmpty()) {
            resultList.addAll(children)

            children.forEach { c ->
                findChildren(c, resultList, allCategory)
            }
        }

        return resultList
    }
}
