package com.catprogrammer.pim.entity

import javax.persistence.*

@Entity
data class PimLocale(
    @Column(unique = true)
    val name: String,
    val languageCode: String,
    @Column(unique = true)
    val countryCode: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0
}
