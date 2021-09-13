package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.VariationAttribute
import org.springframework.data.jpa.repository.JpaRepository

interface VariationAttributeRepository : JpaRepository<VariationAttribute, Long>
