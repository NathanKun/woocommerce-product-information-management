package com.catprogrammer.pim.entity

import com.catprogrammer.pim.enumeration.ProductType
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.OffsetDateTime
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
class Product(
    @Column(unique = true)
    val sku: String,
    @Enumerated(EnumType.STRING)
    val type: ProductType,
    var parent: String?,
    var name: String,
    var image: String?,
    var menuOrder: Int,
    @ElementCollection(fetch = FetchType.EAGER)
    var categoryIds: Set<Long>,
    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL]
    )
    val attributes: List<AttributeValuePair>,
    @OneToMany(
        fetch = FetchType.EAGER,
        cascade = [CascadeType.ALL]
    )
    @Fetch(FetchMode.SUBSELECT)
    var variationConfigurations: List<VariationConfiguration>?,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0

    // id woocommerce
    @ElementCollection(fetch = FetchType.EAGER)
    val idWoo: MutableSet<String> = HashSet()

    var deletedAt: OffsetDateTime? = null

    @CreatedDate
    var createdAt: OffsetDateTime? = null

    @LastModifiedDate
    var updatedAt: OffsetDateTime? = null
}
