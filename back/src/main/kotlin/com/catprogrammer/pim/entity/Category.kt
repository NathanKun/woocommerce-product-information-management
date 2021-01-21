package com.catprogrammer.pim.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.OffsetDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
data class Category(
    @Column(unique = true, nullable = false)
    val code: String,
    @Column(nullable = false)
    var name: String,
    // id woocommerce
    @Column(unique = true)
    val idWoo: Long? = null,
    var parentId: Long?, // point to id, not idWoo
    var image: String?,
    var menuOrder: Int,
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
