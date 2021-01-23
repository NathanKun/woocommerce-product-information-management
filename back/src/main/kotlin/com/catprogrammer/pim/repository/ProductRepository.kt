package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.Product
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Long>
