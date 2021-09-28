package com.catprogrammer.pim.service

import com.catprogrammer.pim.entity.NextEan
import com.catprogrammer.pim.repository.NextEanRepository
import com.catprogrammer.pim.tool.Ean13Tool
import org.springframework.stereotype.Service

@Service
class NextEanService(private val nextEanRepository: NextEanRepository) {
    @Synchronized
    fun next(categoryEan: String): String {
        var nextEan = nextEanRepository.findByCategoryEan(categoryEan)

        if (nextEan == null) {
            nextEan = NextEan(categoryEan)
        }

        val result: String = nextEan.next

        nextEan.next = Ean13Tool.increment(nextEan.next)
        nextEanRepository.save(nextEan)
        nextEanRepository.flush()

        return result
    }
}
