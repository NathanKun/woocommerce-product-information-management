package com.catprogrammer.pim.entity

import org.springframework.security.core.GrantedAuthority
import javax.persistence.Entity
import javax.persistence.Id

@Entity
class UserAuthority(
    @Id private val authority: String
) : GrantedAuthority {
    override fun getAuthority() = authority

    companion object {
        val ADMIN = UserAuthority("ADMIN")

        val CREATOR = UserAuthority("CREATOR")

        val All_AUTHORITIES = setOf(
            ADMIN, CREATOR
        )
    }
}
