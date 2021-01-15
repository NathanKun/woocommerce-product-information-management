package com.catprogrammer.pim.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.OffsetDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
class Category(
    @Column(unique = true)
    val code: String,
    val name: String,
    var parentId: Long?,
    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL]
    )
    val attributes: List<AttributeValuePair>
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0

    @CreatedDate
    var createdAt: OffsetDateTime? = null

    @LastModifiedDate
    var updatedAt: OffsetDateTime? = null
}
