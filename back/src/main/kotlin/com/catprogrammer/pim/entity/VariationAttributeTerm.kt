package com.catprogrammer.pim.entity

import javax.persistence.*

@Entity
class VariationAttributeTerm(
    val name: String,
    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL]
    )
    val translations: Set<VariationAttributeTermTranslation>
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}

