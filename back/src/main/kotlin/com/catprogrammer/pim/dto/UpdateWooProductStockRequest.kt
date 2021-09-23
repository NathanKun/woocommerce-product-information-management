package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UpdateWooProductStockRequest(
    val id: Long,
    @JsonProperty("stock_quantity")
    val stockQuantity: Int,
    @JsonProperty("manage_stock")
    val manageStock: Boolean?
)
