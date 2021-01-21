package com.catprogrammer.pim.exception

class OkHttpRequestFailException : Exception {
    constructor(url: String, msg: String) : super(msg)
    constructor(url: String, msg: String?, e: Exception) : super(msg, e)
}
