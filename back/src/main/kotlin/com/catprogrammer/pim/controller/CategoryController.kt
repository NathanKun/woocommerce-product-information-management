package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.IdRequest
import com.catprogrammer.pim.dto.NewCategoryRequest
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.service.CategoryService
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/categories")
@RestController
class CategoryController(
    private val categoryService: CategoryService
) {

    @GetMapping("/")
    fun findAll(): RestResponse<List<Category>> = RestResponse.successResponse(categoryService.findAll())

    @PostMapping("/")
    fun addNewCategory(@RequestBody category: NewCategoryRequest): RestResponse<String> {
        if (category.code.isBlank()) {
            return RestResponse.failResponse("code must not be empty")
        }

        if (category.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        val catg = this.categoryService.save(category)
        return RestResponse.successResponse(catg.id.toString())
    }

    @PutMapping("/")
    fun updateCategory(@RequestBody category: Category): RestResponse<String> {
        if (category.code.isBlank()) {
            return RestResponse.failResponse("code must not be empty")
        }

        if (category.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        this.categoryService.save(category)
        return RestResponse.ok()
    }

    @DeleteMapping("/")
    fun deleteCategory(@RequestBody req: IdRequest): RestResponse<String> {
        this.categoryService.delete(req.id)
        return RestResponse.ok()
    }
}
