package com.catprogrammer.pim.service

import com.catprogrammer.pim.entity.User
import com.catprogrammer.pim.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.util.*
import java.util.regex.Matcher
import java.util.regex.Pattern
import javax.transaction.Transactional


@Service
class UserDetailService(private val userRepository: UserRepository) : UserDetailsService {

    /**
     * Load user by username OR email
     */
    override fun loadUserByUsername(username: String?): UserDetails {
        if (username == null || username.isEmpty()) {
            throw UsernameNotFoundException("username is empty")
        }

        return userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("user with username $username not found")
    }

    @Transactional
    fun loadUserById(id: Long): User {
        val user: Optional<User?> = userRepository.findById(id)
        return user.orElseThrow { UsernameNotFoundException("User not found") }!!
    }

    companion object {
        private val VALID_EMAIL_ADDRESS_REGEX: Pattern =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE)

        private fun validateEmail(emailStr: String): Boolean {
            val matcher: Matcher = VALID_EMAIL_ADDRESS_REGEX.matcher(emailStr)
            return matcher.find()
        }
    }


}
