package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.UserRole
import org.springframework.data.jpa.repository.JpaRepository


interface UserRoleRepository : JpaRepository<UserRole, String>
