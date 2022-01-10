package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.IdRequest
import com.catprogrammer.pim.dto.MenuOrdersRequest
import com.catprogrammer.pim.dto.NewProductRequest
import com.catprogrammer.pim.entity.Product
import com.catprogrammer.pim.service.ProductService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/products")
@RestController
class ProductController(
    private val productService: ProductService
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/")
    fun findAll(): RestResponse<List<Product>> = RestResponse.successResponse(productService.findAllNotDeleted())

    @GetMapping("/deleted")
    fun findAllDeleted(): RestResponse<List<Product>> = RestResponse.successResponse(productService.findAllDeleted())

    @GetMapping("/{id}")
    fun getProduct(@PathVariable id: Long) = RestResponse.successResponse(productService.findById(id))

    @PostMapping("/")
    fun addNewProduct(@RequestBody product: NewProductRequest): RestResponse<String> {
        if (product.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        if (product.id != null && product.id != -1L) {
            return RestResponse.failResponse("ID must not be set, are you updating a product?")
        }

        val pdt = this.productService.save(product)
        return RestResponse.successResponse(pdt.id.toString())
    }

    @PutMapping("/")
    fun updateProduct(@RequestBody product: Product): RestResponse<String> {
        if (product.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        // explicitly refuse to change sku
        if (product.sku != productService.findById(product.id)?.sku) {
            RestResponse.failResponse("SKU in request not match the existing product's SKU")
        }

        this.productService.save(product)
        return RestResponse.ok()
    }

    @DeleteMapping("/")
    fun deleteProduct(@RequestBody req: IdRequest): RestResponse<String> {
        this.productService.delete(req.id)
        return RestResponse.ok()
    }

    @PostMapping("/undelete/{pdtId}")
    fun undeleteProduct(@PathVariable pdtId: Long): RestResponse<String> {
        this.productService.undelete(pdtId)
        return RestResponse.ok()
    }

    @PutMapping("/order")
    fun saveMenuOrders(@RequestBody req: MenuOrdersRequest): RestResponse<String> {
        val pdts = productService.findAllNotDeleted()

        req.data.forEach { pair ->
            val found = pdts.find { it.id == pair.id }
            if (found == null) {
                logger.warn("saveMenuOrders: can not find Product with id = ${pair.id}")
            } else {
                found.menuOrder = pair.menuOrder
                productService.save(found)
            }
        }

        return RestResponse.ok()
    }
}
