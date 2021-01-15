package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.service.CategoryService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/categories")
@RestController
class CategoryController(
    private val categoryService: CategoryService
) {

    @GetMapping("/")
    fun findAll(): RestResponse<List<Category>> = RestResponse.successResponse(categoryService.findAll())
}
