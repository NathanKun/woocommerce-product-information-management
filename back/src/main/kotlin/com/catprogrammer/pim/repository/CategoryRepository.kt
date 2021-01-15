package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.Category
import org.springframework.data.jpa.repository.JpaRepository

interface CategoryRepository : JpaRepository<Category, Long>
