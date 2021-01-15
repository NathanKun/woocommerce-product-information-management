package com.catprogrammer.pim.service

import com.catprogrammer.pim.entity.User
import com.catprogrammer.pim.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service


@Service
class UserService(
    private val userRepository: UserRepository,
    private val bCryptPasswordEncoder: BCryptPasswordEncoder,
) {

    fun saveNewUser(newUser: User): User {
        if (newUser.password != null) {
            newUser.setPassword(bCryptPasswordEncoder.encode(newUser.password))
        }
        return userRepository.save(newUser)
    }

    fun updateUser(user: User): User = userRepository.save(user)

    fun findById(id: Long): User? = userRepository.findById(id).orElse(null)

    fun findByUsername(name: String) = userRepository.findByUsername(name)

    fun findAll(): MutableList<User> = userRepository.findAll()

    fun findAll(pageable: Pageable): Page<User> = userRepository.findAll(pageable)

    fun isEmailExist(email: String): Boolean = userRepository.findByEmail(email) != null

    fun isUsernameExist(username: String): Boolean = userRepository.findByUsername(username) != null

}
