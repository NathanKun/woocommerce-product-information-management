package com.catprogrammer.pim.entity

import javax.persistence.*

@Entity
class VariationConfiguration(
    val attributeName: String,
    @ElementCollection(fetch = FetchType.EAGER)
    val attributeValues: List<String>
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}

