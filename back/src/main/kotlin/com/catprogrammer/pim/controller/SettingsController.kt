package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.dto.AttributeRequest
import com.catprogrammer.pim.dto.IdRequest
import com.catprogrammer.pim.dto.PimLocaleRequest
import com.catprogrammer.pim.dto.SettingsDto
import com.catprogrammer.pim.service.SettingsService
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.sql.SQLIntegrityConstraintViolationException

@RequestMapping("/api/settings")
@RestController
class SettingsController(
    private val settingsService: SettingsService
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/")
    fun getSettings(): RestResponse<SettingsDto> {
        return RestResponse.successResponse(settingsService.getSettings())
    }

    @PostMapping("/categoryAttribute")
    fun addCategoryAttribute(@RequestBody rq: AttributeRequest): RestResponse<String> {
        settingsService.addCategoryAttribute(rq.name, rq.localizable, rq.valueType, rq.description)
        return RestResponse.ok()
    }

    @PostMapping("/productAttribute")
    fun addProductAttribute(@RequestBody rq: AttributeRequest): RestResponse<String>  {
        settingsService.addProductAttribute(rq.name, rq.localizable, rq.valueType, rq.variation ?: false, rq.description)
        return RestResponse.ok()
    }

    @PostMapping("/pimLocale")
    fun addPimLocale(@RequestBody locale: PimLocaleRequest): RestResponse<String>  {
        settingsService.addPimLocale(locale.name, locale.languageCode, locale.countryCode)
        return RestResponse.ok()
    }

    @DeleteMapping("/categoryAttribute")
    fun deleteCategoryAttribute(@RequestBody rq: IdRequest): RestResponse<String>  {
        settingsService.deleteCategoryAttribute(rq.id)
        return RestResponse.ok()
    }

    @DeleteMapping("/productAttribute")
    fun deleteProductAttribute(@RequestBody rq: IdRequest): RestResponse<String>  {
        settingsService.deleteProductAttribute(rq.id)
        return RestResponse.ok()
    }

    @DeleteMapping("/pimLocale")
    fun deletePimLocale(@RequestBody rq: IdRequest): RestResponse<String>  {
        settingsService.deletePimLocale(rq.id)
        return RestResponse.ok()
    }

    @ExceptionHandler(value = [DataIntegrityViolationException::class, SQLIntegrityConstraintViolationException::class])
    fun handleSQLIntegrityConstraintViolationException(e: Exception): ResponseEntity<RestResponse<String>> {
        logger.info("${e.javaClass.simpleName}: ${e.message}")
        return ResponseEntity(
            RestResponse.failResponse(e.message!!), HttpStatus.BAD_REQUEST
        )
    }
}
