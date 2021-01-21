package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import java.util.*


data class CategoryWoo(
    val id: Long,
    val name: String,
    val slug: String,
    val parent: Long,
    val description: String,
    val display: String,
    val image: Image?,

    @JsonProperty("menu_order")
    val menuOrder: Long,

    val count: Long,
    val lang: String,
    val translations: Translations,

    @JsonProperty("yoast_head")
    val yoastHead: String,

    @JsonProperty("_links")
    val links: Links
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CategoryWooRequest(
    val name: String,
    val slug: String,
    val parent: Long?,
    val description: String,
    val image: ImageRequest?,
    @JsonProperty("menu_order")
    val menuOrder: Long,
    val lang: String,
)

data class Image(
    val id: Long,

    @JsonProperty("date_created")
    val dateCreated: String,

    @JsonProperty("date_created_gmt")
    val dateCreatedGmt: String,

    @JsonProperty("date_modified")
    val dateModified: String,

    @JsonProperty("date_modified_gmt")
    val dateModifiedGmt: String,

    val src: String,
    val name: String,
    val alt: String?
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ImageRequest(
    val id: Long?,
    val src: String?,
    val name: String?,
    val alt: String?
)

data class Links(
    val self: List<Collection>,
    val collection: List<Collection>,
    val up: List<Collection>? = null
)

data class Collection(
    val href: String
)

class Translations {
    val data: MutableMap<String, Any> = HashMap()

    @JsonAnySetter
    fun setUnknownField(name: String, value: Any) {
        data[name] = value
    }
}

