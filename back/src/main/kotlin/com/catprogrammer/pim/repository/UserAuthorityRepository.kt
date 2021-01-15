package com.catprogrammer.pim.repository

import com.catprogrammer.pim.entity.UserAuthority
import org.springframework.data.jpa.repository.JpaRepository


interface UserAuthorityRepository : JpaRepository<UserAuthority, String>
