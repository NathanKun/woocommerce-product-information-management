package com.catprogrammer.pim.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.security.core.userdetails.UserDetails
import java.time.OffsetDateTime
import javax.persistence.*


@Suppress("JpaDataSourceORMInspection")
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "user_account")
class User(
    @Column(unique = true)
    private var username: String,
    @JsonIgnore
    private var password: String?,
    @Column(unique = true)
    var email: String?,
) : UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    var roles: MutableSet<UserRole> = mutableSetOf()

    @JsonProperty("roles")
    fun getRoles(): List<String> = roles.map(UserRole::role)

    @CreatedDate
    var createdAt: OffsetDateTime? = null

    @LastModifiedDate
    var updatedAt: OffsetDateTime? = null


    override fun getUsername() = username

    fun setUsername(newName: String) {
        this.username = newName
    }

    override fun getPassword() = password

    @JsonIgnore
    override fun getAuthorities() =
        this.roles.flatMap { it.userAuthorities }
            .distinct()
            .toSet()

    fun setPassword(pwd: String) {
        this.password = pwd
    }

    @JsonIgnore
    override fun isAccountNonExpired(): Boolean {
        return true // if account expired stuff
    }

    @JsonIgnore
    override fun isAccountNonLocked(): Boolean {
        return true // again reverse of locked
    }

    @JsonIgnore
    override fun isCredentialsNonExpired(): Boolean {
        return true // reverse of password expired
    }

    @JsonIgnore
    override fun isEnabled(): Boolean {
        return true
    }
}

