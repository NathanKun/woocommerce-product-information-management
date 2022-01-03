package com.catprogrammer.pim.dto

data class FindProductsNotExistInPimResponse(
    val variations: List<Long>,
    val products: List<Long>
)
