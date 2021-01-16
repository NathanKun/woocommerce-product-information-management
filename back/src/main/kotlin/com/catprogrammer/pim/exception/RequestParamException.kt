package com.catprogrammer.pim.exception


class RequestParamException : Exception {
    constructor(msg: String) : super(msg)
    constructor(msg: String?, e: Exception) : super(msg, e)
}
