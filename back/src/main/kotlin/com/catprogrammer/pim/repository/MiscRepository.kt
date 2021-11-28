package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.MiscItem
import org.springframework.data.jpa.repository.JpaRepository

interface MiscRepository : JpaRepository<MiscItem, Long> {
    fun findByName(name: String): MiscItem?
}
