package com.catprogrammer.pim.entity

import com.catprogrammer.pim.enumeration.AttributeValueType
import javax.persistence.*

@Entity
data class AttributeValuePair(
    val name: String,
    @Column(columnDefinition = "text")
    val value: String,
    @Enumerated(EnumType.STRING)
    val type: AttributeValueType
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
