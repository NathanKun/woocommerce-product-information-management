package com.catprogrammer.pim.tool

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.ObjectMapper
import java.io.IOException


class JsonToStringDeserializer : JsonDeserializer<String?>() {
    @Throws(IOException::class, JsonProcessingException::class)
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext?): String? {
        return ObjectMapper().writeValueAsString(ctxt!!.readTree(p))
    }
}
