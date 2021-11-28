package com.catprogrammer.pim.exception


class ResourceNotFoundException : Exception {
    constructor(msg: String) : super(msg)
    constructor(msg: String?, e: Exception) : super(msg, e)
}
