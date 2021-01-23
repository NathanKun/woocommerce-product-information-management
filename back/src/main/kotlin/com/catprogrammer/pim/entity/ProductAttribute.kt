package com.catprogrammer.pim.entity

import com.catprogrammer.pim.enumeration.AttributeValueType
import javax.persistence.*

@Entity
data class ProductAttribute(
    @Column(unique = true)
    val name: String,
    val localizable: Boolean,
    @Enumerated(EnumType.STRING)
    val valueType: AttributeValueType,
    val variation: Boolean, // if this attr is also available for variation product
    var description: String,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
