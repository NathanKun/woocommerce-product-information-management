package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.CategoryAttribute
import org.springframework.data.jpa.repository.JpaRepository

interface CategoryAttributeRepository : JpaRepository<CategoryAttribute, Long>
