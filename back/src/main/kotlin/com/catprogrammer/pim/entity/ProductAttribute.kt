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
    val description: String,
    @ElementCollection(fetch = FetchType.EAGER)
    val options: List<String>?, // SELECT: list of options; TEXT: list[0] is required, list[1] validation pattern; NUMBER: list[0] is required, list[1] min, list[2]: max
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
