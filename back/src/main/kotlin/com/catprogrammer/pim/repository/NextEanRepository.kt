package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.NextEan
import org.springframework.data.jpa.repository.JpaRepository

interface NextEanRepository : JpaRepository<NextEan, Long> {
    fun findByCategoryEan(categoryEan: String): NextEan?
}
