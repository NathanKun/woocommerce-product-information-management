package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.ProductAttribute
import org.springframework.data.jpa.repository.JpaRepository

interface ProductAttributeRepository : JpaRepository<ProductAttribute, Long>
