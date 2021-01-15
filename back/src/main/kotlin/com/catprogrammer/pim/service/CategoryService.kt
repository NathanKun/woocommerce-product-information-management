package com.catprogrammer.pim.service

import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(private val categoryRepository: CategoryRepository) {
    fun findAll(): List<Category> = categoryRepository.findAll()

    fun save(category: Category) = categoryRepository.save(category)

    fun delete(id: Long) = categoryRepository.deleteById(id)

    fun delete(category: Category) = categoryRepository.delete(category)
}
