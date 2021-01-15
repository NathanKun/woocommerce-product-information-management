package com.catprogrammer.pim.entity

import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.Id
import javax.persistence.ManyToMany

@Entity
class UserRole(
    @Id val role: String,
    @ManyToMany(fetch = FetchType.EAGER)
    val userAuthorities: Set<UserAuthority>
) {
    companion object {
        val ADMIN = UserRole("ADMIN", UserAuthority.All_AUTHORITIES)

        val CREATOR = UserRole("CREATOR", setOf(UserAuthority.CREATOR))


        val All_ROLES = setOf(
            ADMIN, CREATOR
        )
    }
}
