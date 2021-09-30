package com.catprogrammer.pim.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class WpMediaResponse(
    val id: Long,
    @JsonProperty("source_url")
    val sourceUrl: String
)
