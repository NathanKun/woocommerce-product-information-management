package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.Product
import org.springframework.data.jpa.repository.JpaRepository
import java.time.OffsetDateTime

interface ProductRepository : JpaRepository<Product, Long> {
    fun findBySku(sku: String): Product?

    fun findByUpdatedAtIsGreaterThan(updatedAt: OffsetDateTime): List<Product>

    fun findByDeletedAtIsNull(): List<Product>

    fun findByDeletedAtIsNotNull(): List<Product>
}

