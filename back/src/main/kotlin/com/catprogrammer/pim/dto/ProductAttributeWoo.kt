package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

data class ProductAttributeWoo(
    val id: Long,
    val name: String,
    val slug: String,
    val type: String,
    @JsonProperty("order_by")
    val orderBy: String,
    @JsonProperty("has_archives")
    val hasArchives: Boolean,

    @JsonProperty("_links")
    val links: Links
)

data class ProductAttributeTermWoo(
    val id: Long,
    val name: String,
    val slug: String,
    val description: String,
    @JsonProperty("menu_order")
    val menuOrder: Long,
    val count: Long,
    val lang: String,
    val translations: Translations,

    @JsonProperty("_links")
    val links: Links
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ProductAttributeWooRequest(
    val name: String,
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ProductAttributeTermWooRequest(
    val name: String,
    val lang: String?,
    val description: String?,
    val slug: String?,
    @JsonProperty("menu_order")
    val menuOrder: Long,
)
