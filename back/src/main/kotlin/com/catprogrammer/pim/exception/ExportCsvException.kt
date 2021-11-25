package com.catprogrammer.pim.exception


class ExportCsvException : Exception {
    constructor(msg: String) : super(msg)
    constructor(msg: String?, e: Exception) : super(msg, e)
}
