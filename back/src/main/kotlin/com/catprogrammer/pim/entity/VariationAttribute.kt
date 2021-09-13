package com.catprogrammer.pim.entity

import javax.persistence.*


@Entity
class VariationAttribute(
    @Column(unique = true)
    val name: String,
    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL]
    )
    val terms: List<VariationAttributeTerm>
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
