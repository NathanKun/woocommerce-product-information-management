package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonAnySetter
import com.fasterxml.jackson.annotation.JsonProperty
import java.util.HashMap

data class ProductWoo (
    val id: Long,
    val name: String,
    val slug: String,
    val permalink: String,

    @JsonProperty("date_created")
    val dateCreated: String,

    @JsonProperty("date_created_gmt")
    val dateCreatedGmt: String,

    @JsonProperty("date_modified")
    val dateModified: String,

    @JsonProperty("date_modified_gmt")
    val dateModifiedGmt: String,

    val type: Type,
    val status: Status,
    val featured: Boolean,

    @JsonProperty("catalog_visibility")
    val catalogVisibility: CatalogVisibility,

    val description: String,

    @JsonProperty("short_description")
    val shortDescription: String,

    val sku: String,
    val price: String,

    @JsonProperty("regular_price")
    val regularPrice: String,

    @JsonProperty("sale_price")
    val salePrice: String,

    @JsonProperty("date_on_sale_from")
    val dateOnSaleFrom: Any? = null,

    @JsonProperty("date_on_sale_from_gmt")
    val dateOnSaleFromGmt: Any? = null,

    @JsonProperty("date_on_sale_to")
    val dateOnSaleTo: Any? = null,

    @JsonProperty("date_on_sale_to_gmt")
    val dateOnSaleToGmt: Any? = null,

    @JsonProperty("on_sale")
    val onSale: Boolean,

    val purchasable: Boolean,

    @JsonProperty("total_sales")
    val totalSales: Long,

    val virtual: Boolean,
    val downloadable: Boolean,
    val downloads: List<Any?>,

    @JsonProperty("download_limit")
    val downloadLimit: Long,

    @JsonProperty("download_expiry")
    val downloadExpiry: Long,

    @JsonProperty("external_url")
    val externalURL: String,

    @JsonProperty("button_text")
    val buttonText: String,

    @JsonProperty("tax_status")
    val taxStatus: TaxStatus,

    @JsonProperty("tax_class")
    val taxClass: String,

    @JsonProperty("manage_stock")
    val manageStock: Boolean,

    @JsonProperty("stock_quantity")
    val stockQuantity: Any? = null,

    val backorders: Backorders,

    @JsonProperty("backorders_allowed")
    val backordersAllowed: Boolean,

    val backordered: Boolean,

    @JsonProperty("sold_individually")
    val soldIndividually: Boolean,

    val weight: String,
    val dimensions: Dimensions,

    @JsonProperty("shipping_required")
    val shippingRequired: Boolean,

    @JsonProperty("shipping_taxable")
    val shippingTaxable: Boolean,

    @JsonProperty("shipping_class")
    val shippingClass: String,

    @JsonProperty("shipping_class_id")
    val shippingClassID: Long,

    @JsonProperty("reviews_allowed")
    val reviewsAllowed: Boolean,

    @JsonProperty("average_rating")
    val averageRating: String,

    @JsonProperty("rating_count")
    val ratingCount: Long,

    @JsonProperty("upsell_ids")
    val upsellIDS: List<Any?>,

    @JsonProperty("cross_sell_ids")
    val crossSellIDS: List<Any?>,

    @JsonProperty("parent_id")
    val parentID: Long,

    @JsonProperty("purchase_note")
    val purchaseNote: String,

    val categories: List<Category>,
    val tags: List<Category>,
    val images: List<ImageProduct>,
    val attributes: List<Attribute>,

    @JsonProperty("default_attributes")
    val defaultAttributes: List<Any?>,

    val variations: List<Any?>,

    @JsonProperty("grouped_products")
    val groupedProducts: List<Any?>,

    @JsonProperty("menu_order")
    val menuOrder: Long,

    @JsonProperty("price_html")
    val priceHTML: String,

    @JsonProperty("related_ids")
    val relatedIDS: List<Long>,

    @JsonProperty("meta_data")
    val metaData: List<MetaDatum>,

    @JsonProperty("stock_status")
    val stockStatus: StockStatus,

    val lang: String,
    val translations: TranslationsProduct,

    @JsonProperty("yoast_head")
    val yoastHead: String,

    @JsonProperty("pll_sync_post")
    val pllSyncPost: List<Any?>,

    @JsonProperty("_links")
    val links: LinksProduct
)

data class Attribute (
    val id: Long,
    val name: String,
    val position: Long,
    val visible: Boolean,
    val variation: Boolean,
    val options: List<String>
)

data class Category (
    val id: Long,
    val name: String,
    val slug: String
)

data class Dimensions (
    val length: String,
    val width: String,
    val height: String
)

data class ImageProduct (
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
    val alt: String
)

data class LinksProduct (
    val self: List<CollectionProduct>,
    val collection: List<CollectionProduct>
)

data class CollectionProduct (
    val href: String
)

data class MetaDatum (
    val id: Long,
    val key: String,
    val value: String
)

class TranslationsProduct {
    val data: MutableMap<String, Any> = HashMap()

    @JsonAnySetter
    fun setUnknownField(name: String, value: Any) {
        data[name] = value
    }
}

enum class Backorders(val value: String) {
    No("no");

    companion object {
        public fun fromValue(value: String): Backorders = when (value) {
            "no" -> No
            else -> throw IllegalArgumentException()
        }
    }
}

enum class CatalogVisibility(val value: String) {
    Visible("visible");

    companion object {
        fun fromValue(value: String): CatalogVisibility = when (value) {
            "visible" -> Visible
            else      -> throw IllegalArgumentException()
        }
    }
}

enum class Status(val value: String) {
    Publish("publish");

    companion object {
        fun fromValue(value: String): Status = when (value) {
            "publish" -> Publish
            else      -> throw IllegalArgumentException()
        }
    }
}

enum class StockStatus(val value: String) {
    Instock("instock"),
    Outofstock("outofstock");

    companion object {
        fun fromValue(value: String): StockStatus = when (value) {
            "instock"    -> Instock
            "outofstock" -> Outofstock
            else         -> throw IllegalArgumentException()
        }
    }
}

enum class TaxStatus(val value: String) {
    Taxable("taxable");

    companion object {
        fun fromValue(value: String): TaxStatus = when (value) {
            "taxable" -> Taxable
            else      -> throw IllegalArgumentException()
        }
    }
}

enum class Type(val value: String) {
    Simple("simple"),
    Variable("variable"),
    Variation("variation");

    companion object {
        fun fromValue(value: String): Type = when (value) {
            "simple"   -> Simple
            "variable" -> Variable
            "variation" -> Variation
            else       -> throw IllegalArgumentException()
        }
    }
}
