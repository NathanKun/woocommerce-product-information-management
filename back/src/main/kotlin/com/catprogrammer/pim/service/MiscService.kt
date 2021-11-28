package com.catprogrammer.pim.service

import com.catprogrammer.pim.dto.MiscRequest
import com.catprogrammer.pim.entity.MiscItem
import com.catprogrammer.pim.repository.MiscRepository
import org.springframework.stereotype.Service

@Service
class MiscService(private val miscRepository: MiscRepository) {
    fun findByName(name: String) = miscRepository.findByName(name)

    fun save(rq: MiscRequest): MiscItem {
        var miscItem = findByName(rq.name)
        if (miscItem != null) {
            miscItem.value = rq.value
        } else {
            miscItem = MiscItem(rq.name, rq.value)
        }
        miscRepository.save(miscItem)

        return miscItem
    }
}
