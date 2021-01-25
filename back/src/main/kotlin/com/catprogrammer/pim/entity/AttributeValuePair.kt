package com.catprogrammer.pim.entity

import javax.persistence.*

@Entity
data class AttributeValuePair(
    val name: String,
    @Column(columnDefinition = "text")
    val value: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
