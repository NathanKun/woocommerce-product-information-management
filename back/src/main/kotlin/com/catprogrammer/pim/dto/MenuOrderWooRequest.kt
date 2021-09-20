package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class MenuOrderWooRequest(
    val id: Long,
    @JsonProperty("menu_order")
    val menuOrder: Long
)
