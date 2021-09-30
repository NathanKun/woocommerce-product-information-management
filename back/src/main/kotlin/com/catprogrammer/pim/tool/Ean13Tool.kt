package com.catprogrammer.pim.tool


class Ean13Tool {
    companion object {
        fun getCheckSum(code:String): String {
            var odd = 0
            var even = 0
            for (i in code.indices) {
                val index = i+1
                if (isOdd(index))
                    odd+=code[i].toString().toInt()
                else
                    even+=code[i].toString().toInt()
            }
            return ((10-((odd+even*3)%10))%10).toString()
        }

        fun increment(code: String): String = (code.toInt() + 1).toString().padStart(4, '0').takeLast(4)

        private fun isOdd(x: Int) = x % 2 != 0
    }
}
