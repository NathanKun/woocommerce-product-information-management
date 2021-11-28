package com.catprogrammer.pim.controller

import com.catprogrammer.pim.controller.response.RestResponse
import com.catprogrammer.pim.exception.ResourceNotFoundException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MissingRequestCookieException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import java.util.*


@ControllerAdvice
@RestController
class GlobalExceptionHandler {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private val unknownError = "Unknown error"

    @ExceptionHandler(value = [Exception::class])
    fun handleException(e: Exception): ResponseEntity<RestResponse<String>> {
        logger.error("GlobalExceptionHandler", e)
        val msg = e.message ?: unknownError
        return ResponseEntity(RestResponse.failResponse(msg), HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(e: AccessDeniedException): ResponseEntity<Any?>? {
        val msg = e.message ?: unknownError
        logger.error("AccessDeniedException: " + e.message, e)
        return if (msg.lowercase(Locale.getDefault()).indexOf("access is denied") > -1) {
            ResponseEntity(RestResponse.failResponse("Unauthorized Access"), HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(RestResponse.failResponse(msg), HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ExceptionHandler(value = [MissingRequestCookieException::class])
    fun handleMissingRequestCookieException(e: MissingRequestCookieException): ResponseEntity<RestResponse<String>> {
        logger.error("MissingRequestCookieException: " + e.message, e)
        return ResponseEntity(RestResponse.failResponse(e.message), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [MissingServletRequestParameterException::class])
    fun handleMissingServletRequestParameterException(e: MissingServletRequestParameterException): ResponseEntity<RestResponse<String>> {
        logger.error("MissingServletRequestParameterException: " + e.message, e)
        return ResponseEntity(RestResponse.failResponse(e.message), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [HttpRequestMethodNotSupportedException::class])
    fun handleHttpRequestMethodNotSupportedException(e: HttpRequestMethodNotSupportedException): ResponseEntity<RestResponse<String>> {
        logger.error("HttpRequestMethodNotSupportedException: " + e.message, e)
        return ResponseEntity(RestResponse.failResponse(e.message ?: "Request method not supported"), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [MethodArgumentTypeMismatchException::class])
    fun handleMethodArgumentTypeMismatchException(e: MethodArgumentTypeMismatchException): ResponseEntity<RestResponse<String>> {
        val msg = e.message
        logger.error("MethodArgumentTypeMismatchException: $msg", e)

        if (msg?.contains("No enum constant") == true) {
            return ResponseEntity(RestResponse.failResponse("Enum incorrect"), HttpStatus.BAD_REQUEST)
        } else if (msg?.contains("Invalid boolean value") == true) {
            return ResponseEntity(RestResponse.failResponse("Invalid boolean value"), HttpStatus.BAD_REQUEST)
        }
        return ResponseEntity(RestResponse.failResponse(unknownError), HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @ExceptionHandler(value = [ResourceNotFoundException::class])
    fun handleResourceNotFoundException(e: ResourceNotFoundException): ResponseEntity<RestResponse<String>> {
        val msg = e.message
        logger.error("ResourceNotFoundException: $msg", e)
        return ResponseEntity(RestResponse.failResponse(msg), HttpStatus.NOT_FOUND)
    }
}
