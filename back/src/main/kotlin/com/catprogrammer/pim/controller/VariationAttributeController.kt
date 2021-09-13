package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.IdRequest
import com.catprogrammer.pim.dto.NewVariationAttributeRequest
import com.catprogrammer.pim.entity.VariationAttribute
import com.catprogrammer.pim.service.VariationAttributeService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/variation-attributes")
@RestController
class VariationAttributeController(
    private val variationAttributeService: VariationAttributeService
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/")
    fun findAll(): RestResponse<List<VariationAttribute>> = RestResponse.successResponse(variationAttributeService.findAll())

    @PostMapping("/")
    fun addNewVariationAttribute(@RequestBody attr: NewVariationAttributeRequest): RestResponse<String> {
        if (attr.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        val newAttr = this.variationAttributeService.save(attr)
        return RestResponse.successResponse(newAttr.id.toString())
    }

    @PutMapping("/")
    fun updateVariationAttribute(@RequestBody attr: VariationAttribute): RestResponse<String> {
        if (attr.name.isBlank()) {
            return RestResponse.failResponse("name must not be empty")
        }

        this.variationAttributeService.save(attr)
        return RestResponse.ok()
    }

    @DeleteMapping("/")
    fun deleteVariationAttribute(@RequestBody req: IdRequest): RestResponse<String> {
        this.variationAttributeService.delete(req.id)
        logger.debug("Deleted VariationAttribute ${req.id}")
        return RestResponse.ok()
    }
}
