package com.catprogrammer.pim.config

import com.catprogrammer.pim.entity.*
import com.catprogrammer.pim.enumeration.AttributeValueType
import com.catprogrammer.pim.repository.*
import com.catprogrammer.pim.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.core.Ordered
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Component
import java.util.*
import javax.transaction.Transactional


@Component
class InitialDataLoader(
    private val userService: UserService,
    private val userAuthorityRepository: UserAuthorityRepository,
    private val userRoleRepository: UserRoleRepository,
    private val initialAccountConfig: InitialAccountConfig,
    private val pimLocaleRepository: PimLocaleRepository,
    private val categoryAttributeRepository: CategoryAttributeRepository,
    private val productAttributeRepository: ProductAttributeRepository,
    private val categoryRepository: CategoryRepository,
    private val productRepository: ProductRepository
) : ApplicationListener<ContextRefreshedEvent>, Ordered {

    private val logger = LoggerFactory.getLogger(javaClass)


    private var alreadySetup = false

    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        initData()
    }

    override fun getOrder() = 10

    @Transactional
    fun initData() {
        if (alreadySetup) {
            return
        }

        logger.info("InitialDataLoader running...")

        // create user authorities
        UserAuthority.All_AUTHORITIES.forEach { createNotFound(it, it.authority, userAuthorityRepository) }

        // create user roles
        UserRole.All_ROLES.forEach { createNotFound(it, it.role, userRoleRepository) }

        // add initial admin account
        if (userService.findByUsername(initialAccountConfig.username) == null) {
            val initialAdmin = User(
                initialAccountConfig.username,
                initialAccountConfig.password,
                initialAccountConfig.email
            )
            initialAdmin.roles.add(UserRole.ADMIN)
            userService.saveNewUser(initialAdmin)
            logger.info("Added initial admin ${initialAdmin.username}")
        }

        // add pim locales
        if (pimLocaleRepository.findAll().isEmpty()) {
            pimLocaleRepository.save(PimLocale("France", "fr", "fr"))
            pimLocaleRepository.save(PimLocale("UK", "en", "gb"))
            pimLocaleRepository.save(PimLocale("Italy", "it", "it"))
        }

        // add attributes
        if (categoryAttributeRepository.findAll().isEmpty()) {
            categoryAttributeRepository.save(CategoryAttribute("name", true, AttributeValueType.TEXT, "显示名"))
            categoryAttributeRepository.save(CategoryAttribute("description", true, AttributeValueType.RICH_TEXT, "显示描述"))
            categoryAttributeRepository.save(CategoryAttribute("image2", true, AttributeValueType.IMAGE, "类型测试"))
            categoryAttributeRepository.save(CategoryAttribute("imageSet", true, AttributeValueType.IMAGE_SET, "类型测试"))
            categoryAttributeRepository.save(CategoryAttribute("bool", true, AttributeValueType.BOOLEAN, "类型测试"))
        }

        if (productAttributeRepository.findAll().isEmpty()) {
            productAttributeRepository.save(ProductAttribute("name", true, AttributeValueType.TEXT, "显示名"))
            productAttributeRepository.save(ProductAttribute("description", true, AttributeValueType.RICH_TEXT, "显示描述"))
            productAttributeRepository.save(ProductAttribute("image2", true, AttributeValueType.IMAGE, "类型测试"))
            productAttributeRepository.save(ProductAttribute("imageSet", true, AttributeValueType.IMAGE_SET, "类型测试"))
        }

        // add categories
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(
                Category(
                    "catg-sample-1", "示例类别1", null, "https://http.cat/500", 0, listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 1", AttributeValueType.TEXT),
                    )
                )
            )
            categoryRepository.save(Category("catg-sample-2", "示例类别2", null, null, 5, emptyList()))
            categoryRepository.save(Category("catg-sample-1-1", "示例类别1-1", 1, null, 1, emptyList()))
            categoryRepository.save(Category("catg-sample-1-2", "示例类别1-2", 1, null, 4, emptyList()))
            categoryRepository.save(Category("catg-sample-1-1-1", "示例类别1-1-1", 3, null, 2, emptyList()))
            categoryRepository.save(Category("catg-sample-1-1-2", "示例类别1-1-2", 3, null, 3, emptyList()))
            categoryRepository.save(Category("catg-sample-2-1", "示例类别2-1", 2, null, 6, emptyList()))
        }

        // add products
        if (productRepository.findAll().isEmpty()) {
            productRepository.save(
                Product(
                    "product-sample-1", "示例产品1", null, "https://http.cat/508", 0, setOf(5, 7), listOf(
                        AttributeValuePair("name#fr", "Produit Exemple 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Product 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian product 1", AttributeValueType.TEXT),
                    )
                )
            )
            productRepository.save(Product("product-sample-2", "示例产品2", null, null, 1, setOf(6), emptyList()))
            productRepository.save(Product("product-sample-3", "示例产品3", null, null, 2, setOf(2), emptyList()))
            productRepository.save(Product("product-sample-3-1", "示例产品3-1", 4, null, 3, setOf(2), emptyList()))
            productRepository.save(Product("product-sample-3-2", "示例产品3-2", 4, null, 4, setOf(2), emptyList()))
            productRepository.save(Product("product-sample-3-3", "示例产品3-3", 4, null, 5, setOf(2), emptyList()))
        }

        alreadySetup = true

        logger.info("InitialDataLoader ended")
    }

    @Transactional
    fun <T : Any, ID : Any> createNotFound(item: T, id: ID, repo: JpaRepository<T, ID>) {
        val found: Optional<T> = repo.findById(id)
        if (!found.isPresent) {
            repo.save(item)
        }
    }
}
