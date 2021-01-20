package com.catprogrammer.pim.dto

data class MenuOrdersRequest(
    val data: List<Pair>
) {
    data class Pair(val id: Long, val menuOrder: Int)
}
