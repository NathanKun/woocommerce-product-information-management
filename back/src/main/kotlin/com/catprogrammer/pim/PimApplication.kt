package com.catprogrammer.pim

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@ConfigurationPropertiesScan
@SpringBootApplication
class PimApplication

fun main(args: Array<String>) {
	runApplication<PimApplication>(*args)
}
