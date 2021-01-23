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
    private val catgAttrRepo: CategoryAttributeRepository,
    private val pdtAttrRepo: ProductAttributeRepository,
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

        // add catg attributes
        if (catgAttrRepo.findAll().isEmpty()) {
            catgAttrRepo.save(CategoryAttribute("name", true, AttributeValueType.TEXT, "显示名"))
            catgAttrRepo.save(CategoryAttribute("description", true, AttributeValueType.RICH_TEXT, "显示描述"))
            catgAttrRepo.save(CategoryAttribute("slug", true, AttributeValueType.TEXT, "地址栏名称"))
        }

        // add categories
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(
                Category(
                    "catg-sample-1",
                    "示例类别1",
                    null,
                    "https://woo-imgs.apeprogrammer.com/images/2021/01/14103342/15-1-1.jpg",
                    0,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 1", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-1-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-1-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-1-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-2",
                    "示例类别2",
                    null,
                    "https://woo-imgs.apeprogrammer.com/images/2021/01/14150243/15.-4.-25.-1.jpg",
                    5,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 2", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 2", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 2", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-2-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-2-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-2-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-1-1",
                    "示例类别1-1",
                    1,
                    "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/23288264/e83eedc5-79de-4250-87f1-9d5d5a8ff13a.jpg",
                    1,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-1-1-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-1-1-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-1-1-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 1 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 1 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 1 1</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-1-2",
                    "示例类别1-2",
                    1,
                    "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232754547/2b55c3d5-b0a9-4f21-90b7-b1cb9f2c8963.jpg",
                    4,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 1 2", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 1 2", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 1 2", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-1-2-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-1-2-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-1-2-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 1 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 1 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 1 2</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-1-1-1",
                    "示例类别1-1-1",
                    3,
                    "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232743917/35312332-d964-4868-a46c-535392222132.jpg",
                    2,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 1 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 1 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 1 1 1", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-1-1-1-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-1-1-1-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-1-1-1-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 111</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 111</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 111</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-1-1-2",
                    "示例类别1-1-2",
                    3,
                    "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232732551/22e88208-85d5-4ff7-9740-8ef39546df98.jpg",
                    3,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 112", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 112", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 112", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-1-1-2-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-1-1-2-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-1-1-2-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 112</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 112</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 112</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
            categoryRepository.save(
                Category(
                    "catg-sample-2-1",
                    "示例类别2-1",
                    2,
                    "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232651139/b3df9ba2-06a8-4ea0-a766-5e3402fbcd06.png",
                    6,
                    listOf(
                        AttributeValuePair("name#fr", "Catégorie Exemple 21", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Category 21", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian category 21", AttributeValueType.TEXT),
                        AttributeValuePair("slug#fr", "catg-2-1-fr", AttributeValueType.TEXT),
                        AttributeValuePair("slug#gb", "catg-2-1-en", AttributeValueType.TEXT),
                        AttributeValuePair("slug#it", "catg-2-1-it", AttributeValueType.TEXT),
                        AttributeValuePair(
                            "description#fr",
                            "<h1>Catégorie Exemple 21</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#gb",
                            "<h1>Sample Category 21</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                        AttributeValuePair(
                            "description#it",
                            "<h1>Oh I don't speak Italian category 21</h1>",
                            AttributeValueType.RICH_TEXT
                        ),
                    )
                )
            )
        }

        // add pdt attributes
        if (pdtAttrRepo.findAll().isEmpty()) {
            // pdtAttrRepo.save(ProductAttribute("ID", true, AttributeValueType.BOOLEAN, "Defining this will overwrite data for that ID on import.")) // id, ex: 100
            pdtAttrRepo.save(ProductAttribute("Type", false, AttributeValueType.TEXT, "产品类型，必须为以下值: simple, variable, grouped, external, variation, virtual, downloadable. 支持多个值.")) // type, ex: simple, variation, virtual
            pdtAttrRepo.save(ProductAttribute("SKU", false, AttributeValueType.TEXT, "仓库管理代号，必填，ex: my-sku")) // sku, ex: my-sku
            pdtAttrRepo.save(ProductAttribute("Name", true, AttributeValueType.TEXT, "产品名，必填")) // name, ex: My Product Name
            pdtAttrRepo.save(ProductAttribute("Published", true, AttributeValueType.TEXT, "发布状态，1 for 发布, 0 for 私密, -1 for 草稿.")) // status, ex: 1
            pdtAttrRepo.save(ProductAttribute("Categories", true, AttributeValueType.TEXT, "所属类别。CSV list of categories. > used for hierarchy.")) // category_ids, ex: Category 1, Category 1 > Category 2
            pdtAttrRepo.save(ProductAttribute("Visibility in catalog", true, AttributeValueType.TEXT, "可见度: visible, catalog, search, hidden")) // catalog_visibility, ex: visible
            pdtAttrRepo.save(ProductAttribute("Is featured?", true, AttributeValueType.BOOLEAN, "是否推荐产品")) // featured, ex: 1
            pdtAttrRepo.save(ProductAttribute("Short description", true, AttributeValueType.TEXT, "短描述")) // short_description, ex: This is a product.
            pdtAttrRepo.save(ProductAttribute("Description", true, AttributeValueType.RICH_TEXT, "描述")) // description, ex: This is more information about a product.
            pdtAttrRepo.save(ProductAttribute("Sale price", true, AttributeValueType.TEXT, "促销价格")) // sale_price, ex: 20.99
            pdtAttrRepo.save(ProductAttribute("Regular price", true, AttributeValueType.TEXT, "价格")) // regular_price, ex: 24.99
            pdtAttrRepo.save(ProductAttribute("Date sale price starts", true, AttributeValueType.TEXT, "促销开始时间，填写日期或留空，ex: 2013-06-07 10:53:15")) // date_on_sale_from, ex: 2013-06-07 10:53:15
            pdtAttrRepo.save(ProductAttribute("Date sale price ends", true, AttributeValueType.TEXT, "促销结束时间")) // date_on_sale_to, ex: 2013-06-07 10:53:15
            pdtAttrRepo.save(ProductAttribute("Images", true, AttributeValueType.IMAGE_SET, "图片")) // image_id / gallery_image_ids, ex: http://somewhere.com/image.jpg, http://somewhere.com/image2.jpg
            pdtAttrRepo.save(ProductAttribute("Tax status", true, AttributeValueType.TEXT, "是否可税: taxable, shipping, none")) // tax_status, ex: taxable
            pdtAttrRepo.save(ProductAttribute("Tax class", true, AttributeValueType.TEXT, "税类")) // tax_class, ex: standard
            pdtAttrRepo.save(ProductAttribute("In stock?", false, AttributeValueType.BOOLEAN, "是否有库存")) // stock_status, ex: 1
            pdtAttrRepo.save(ProductAttribute("Stock", false, AttributeValueType.BOOLEAN, "库存。填入数字来开启库存管理，空白则不开启库存管理。 parent can be used for variations")) // manage_stock / stock_quantity, ex: 20
            pdtAttrRepo.save(ProductAttribute("Low stock amount", false, AttributeValueType.BOOLEAN, "低库存阈值，填入数字或留空")) // low_stock_amount, ex: 3
            pdtAttrRepo.save(ProductAttribute("Backorders allowed?", false, AttributeValueType.TEXT, "允许缺货下单。1 for 允许, 0 for 不允许, notify for 显示有库存时提醒按钮")) // backorders, ex: 1
            pdtAttrRepo.save(ProductAttribute("Sold individually?", false, AttributeValueType.BOOLEAN, "是否只允许一单买一件")) // sold_individually, ex: 1
            pdtAttrRepo.save(ProductAttribute("Weight (kg)", false, AttributeValueType.TEXT, "重量，填入数字")) // weight, ex: 100
            pdtAttrRepo.save(ProductAttribute("Length (m)", false, AttributeValueType.TEXT, "长，填入数字")) // length, ex: 20
            pdtAttrRepo.save(ProductAttribute("Width (m)", false, AttributeValueType.TEXT, "宽，填入数字")) // width, ex: 20
            pdtAttrRepo.save(ProductAttribute("Height (m)", false, AttributeValueType.TEXT, "高，填入数字")) // height, ex: 20
            pdtAttrRepo.save(ProductAttribute("Allow customer reviews?", false, AttributeValueType.BOOLEAN, "是否允许品论")) // reviews_allowed, ex: 1
            pdtAttrRepo.save(ProductAttribute("Tags", true, AttributeValueType.TEXT, "标签，ex: Tag 1, Tag 2")) // tag_ids, ex: Tag 1, Tag 2
            pdtAttrRepo.save(ProductAttribute("Shipping class", true, AttributeValueType.TEXT, "配送方式类别")) // shipping_class_id, ex: Name
            pdtAttrRepo.save(ProductAttribute("Parent", false, AttributeValueType.TEXT, "父级产品。 Used for variations. Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.")) // parent_id, ex: id:100, SKU-1
            pdtAttrRepo.save(ProductAttribute("Grouped products", true, AttributeValueType.TEXT, "分组产品。List of IDs. Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.")) // children, ex: id:100, id:101, SKU-1, SKU-2
            pdtAttrRepo.save(ProductAttribute("Upsells", true, AttributeValueType.TEXT, "上级销售推荐产品。Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.")) // upsell_ids, ex: id:100, id:101, SKU-1, SKU-2
            pdtAttrRepo.save(ProductAttribute("Cross-sells", true, AttributeValueType.TEXT, "交叉销售推荐产品。Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.")) // cross_sell_ids, ex: id:100, id:101, SKU-1, SKU-2
            pdtAttrRepo.save(ProductAttribute("Purchase Note", true, AttributeValueType.TEXT, "购买时显示的信息")) // purchase_note, ex: Thanks for buying it buddy.
            pdtAttrRepo.save(ProductAttribute("Button text", true, AttributeValueType.TEXT, "购买按钮上的文本")) // button_text, ex: Buy on the WordPress swag store!
            // pdtAttrRepo.save(ProductAttribute("External URL", true, AttributeValueType.BOOLEAN, "Product external URL.")) // product_url, ex: https://mercantile.wordpress.org/product/wordpress-pennant/
            // pdtAttrRepo.save(ProductAttribute("Position", true, AttributeValueType.BOOLEAN, "Menu order, used for sorting.")) // menu_order, ex: 1
            // pdtAttrRepo.save(ProductAttribute("Download limit", true, AttributeValueType.BOOLEAN, "n/a or a limit.")) // download_limit, ex: 1
            // pdtAttrRepo.save(ProductAttribute("Download expiry days", true, AttributeValueType.BOOLEAN, "n/a or a day limit.")) // download_expiry, ex: 1
        }

        // add products
        if (productRepository.findAll().isEmpty()) {
            productRepository.save(
                Product(
                    "sku-1", "product-sample-1", "示例产品1", null, "https://http.cat/508", 0, setOf(5, 7), listOf(
                        AttributeValuePair("name#fr", "Produit Exemple 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#gb", "Sample Product 1", AttributeValueType.TEXT),
                        AttributeValuePair("name#it", "Oh I don't speak Italian product 1", AttributeValueType.TEXT),
                    )
                )
            )
            productRepository.save(Product("sku-2", "product-sample-2", "示例产品2", null, null, 1, setOf(6), emptyList()))
            productRepository.save(Product("sku-3", "product-sample-3", "示例产品3", null, null, 2, setOf(2), emptyList()))
            productRepository.save(Product("sku-4", "product-sample-3-1", "示例产品3-1", 4, null, 3, setOf(2), emptyList()))
            productRepository.save(Product("sku-5", "product-sample-3-2", "示例产品3-2", 4, null, 4, setOf(2), emptyList()))
            productRepository.save(Product("sku-6", "product-sample-3-3", "示例产品3-3", 4, null, 5, setOf(2), emptyList()))
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
