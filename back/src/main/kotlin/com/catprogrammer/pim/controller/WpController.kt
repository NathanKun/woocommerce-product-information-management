package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.WpMediaResponse
import com.catprogrammer.pim.service.WpService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RequestMapping("/api/wp")
@RestController
class WpController(
    private val wpService: WpService,
) {

    @PostMapping("/media")
    fun uploadFile(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("filename") name: String,
        @RequestParam("title") title: String
    ): RestResponse<WpMediaResponse> = RestResponse.successResponse(wpService.uploadMedia(file, name, title))
}
