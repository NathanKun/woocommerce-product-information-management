package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.AttributeRequest
import com.catprogrammer.pim.dto.MiscRequest
import com.catprogrammer.pim.dto.WpMediaResponse
import com.catprogrammer.pim.entity.MiscItem
import com.catprogrammer.pim.exception.ResourceNotFoundException
import com.catprogrammer.pim.service.MiscService
import com.catprogrammer.pim.service.WpService
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RequestMapping("/api/misc")
@RestController
class MiscController(
    private val miscService: MiscService
) {
    @GetMapping("/{name}")
    fun getMisc(@PathVariable name: String): RestResponse<MiscItem> {
        val miscItem = miscService.findByName(name)

        return if (miscItem != null) {
            RestResponse.successResponse(miscItem)
        } else {
            throw ResourceNotFoundException("Misc Item $name not found.")
        }
    }

    @PostMapping("/")
    fun save(@RequestBody rq: MiscRequest): RestResponse<MiscItem> = RestResponse.successResponse(miscService.save(rq))
}
