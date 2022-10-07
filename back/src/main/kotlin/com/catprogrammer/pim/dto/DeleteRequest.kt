package com.catprogrammer.pim.dto

data class DeleteRequest(
    val id: Long,
    val force: Boolean?
)
