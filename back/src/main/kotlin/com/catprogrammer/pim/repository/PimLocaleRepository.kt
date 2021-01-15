package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.PimLocale
import org.springframework.data.jpa.repository.JpaRepository

interface PimLocaleRepository : JpaRepository<PimLocale, Long>
