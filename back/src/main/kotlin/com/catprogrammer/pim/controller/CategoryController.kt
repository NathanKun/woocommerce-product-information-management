package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.IdRequest
import com.catprogrammer.pim.dto.MenuOrdersRequest
import com.catprogrammer.pim.dto.NewCategoryRequest
import com.catprogrammer.pim.entity.Category
import com.catprogrammer.pim.service.CategoryService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/categories")
@RestController
class CategoryController(
    private val categoryService: CategoryService
) {

    private val logger = LoggerFactory.getLogger(javaClass)

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

    @PutMapping("/order")
    fun saveMenuOrders(@RequestBody req: MenuOrdersRequest): RestResponse<String> {
        val catgs = categoryService.findAll()

        req.data.forEach { pair ->
            val found = catgs.find { it.id == pair.id }
            if (found == null) {
                logger.warn("saveMenuOrders: can not find Category with id = ${pair.id}")
            } else {
                found.menuOrder = pair.menuOrder
                categoryService.save(found)
            }
        }

        return RestResponse.ok()
    }
}
