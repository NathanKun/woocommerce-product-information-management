package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class FrontUpdateWooProductStockRequest(
    val id: Long,
    @JsonProperty("stock_quantity")
    val stockQuantity: Int,
    @JsonProperty("parent_id")
    val parentId: Long?,
    @JsonProperty("manage_stock")
    val manageStock: Boolean?
)


data class WooUpdateWooProductStockRequest(
    val id: Long,
    @JsonProperty("stock_quantity")
    val stockQuantity: Int,
    @JsonProperty("manage_stock")
    val manageStock: Boolean?
)
