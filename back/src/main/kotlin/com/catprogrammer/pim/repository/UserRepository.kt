package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.User
import org.springframework.data.jpa.repository.JpaRepository


interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): User?
    fun findByEmail(email: String): User?
    fun findByEmailAndPasswordIsNotNull(email: String): User?
}
