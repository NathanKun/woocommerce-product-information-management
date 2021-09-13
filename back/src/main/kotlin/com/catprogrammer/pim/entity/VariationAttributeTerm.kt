package com.catprogrammer.pim.entity

import javax.persistence.*

@Entity
class VariationAttributeTerm(
    val name: String,
    val lang: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
