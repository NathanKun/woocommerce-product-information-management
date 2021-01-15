package com.catprogrammer.pim.controller.response

class RestResponse<T>(val success: Boolean, val data: T?) {
    companion object {
        fun <T>successResponse(data: T?) = RestResponse(true, data)
        fun <T>failResponse(data: T?) = RestResponse(false, data)
        fun ok() = successResponse("ok")
    }
}
