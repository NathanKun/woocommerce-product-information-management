package com.catprogrammer.pim.config

import com.catprogrammer.pim.entity.*
import com.catprogrammer.pim.enumeration.ProductType
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
import com.catprogrammer.pim.entity.AttributeValuePair as Pair
import com.catprogrammer.pim.entity.CategoryAttribute as CAttr
import com.catprogrammer.pim.entity.ProductAttribute as PAttr
import com.catprogrammer.pim.enumeration.AttributeValueType as Type


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
            catgAttrRepo.save(CAttr("name", true, Type.TEXT, "显示名"))
            catgAttrRepo.save(CAttr("description", true, Type.RICH_TEXT, "显示描述"))
            catgAttrRepo.save(CAttr("slug", true, Type.TEXT, "地址栏名称"))
        }

        // add categories
        if (categoryRepository.findAll().isEmpty()) {
            categoryRepository.save(Category("catg-sample-1", "示例类别1", null, "https://woo-imgs.apeprogrammer.com/images/2021/01/14103342/15-1-1.jpg", 0,
                listOf(Pair("name#fr", "Catégorie Exemple 1"),
                    Pair("name#en", "Sample Category 1"),
                    Pair("name#it", "Oh I don't speak Italian category 1"),
                    Pair("slug#fr", "catg-1-fr"),
                    Pair("slug#en", "catg-1-en"),
                    Pair("slug#it", "catg-1-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 1</h1>"),
                    Pair("description#en", "<h1>Sample Category 1</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 1</h1>"),), "90000"))
            categoryRepository.save(Category("catg-sample-2", "示例类别2", null, "https://woo-imgs.apeprogrammer.com/images/2021/01/14150243/15.-4.-25.-1.jpg", 5,
                listOf(Pair("name#fr", "Catégorie Exemple 2"),
                    Pair("name#en", "Sample Category 2"),
                    Pair("name#it", "Oh I don't speak Italian category 2"),
                    Pair("slug#fr", "catg-2-fr"),
                    Pair("slug#en", "catg-2-en"),
                    Pair("slug#it", "catg-2-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 2</h1>"),
                    Pair("description#en", "<h1>Sample Category 2</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 2</h1>"),), "80000"))
            categoryRepository.save(Category("catg-sample-1-1", "示例类别1-1", 1, "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/23288264/e83eedc5-79de-4250-87f1-9d5d5a8ff13a.jpg", 1,
                listOf(Pair("name#fr", "Catégorie Exemple 1 1"),
                    Pair("name#en", "Sample Category 1 1"),
                    Pair("name#it", "Oh I don't speak Italian category 1 1"),
                    Pair("slug#fr", "catg-1-1-fr"),
                    Pair("slug#en", "catg-1-1-en"),
                    Pair("slug#it", "catg-1-1-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 1 1</h1>"),
                    Pair("description#en", "<h1>Sample Category 1 1</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 1 1</h1>"),), "90100"))
            categoryRepository.save(Category("catg-sample-1-2", "示例类别1-2", 1, "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232754547/2b55c3d5-b0a9-4f21-90b7-b1cb9f2c8963.jpg", 4,
                listOf(Pair("name#fr", "Catégorie Exemple 1 2"),
                    Pair("name#en", "Sample Category 1 2"),
                    Pair("name#it", "Oh I don't speak Italian category 1 2"),
                    Pair("slug#fr", "catg-1-2-fr"),
                    Pair("slug#en", "catg-1-2-en"),
                    Pair("slug#it", "catg-1-2-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 1 2</h1>"),
                    Pair("description#en", "<h1>Sample Category 1 2</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 1 2</h1>"),), "90200"))
            categoryRepository.save(Category("catg-sample-1-1-1", "示例类别1-1-1", 3, "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232743917/35312332-d964-4868-a46c-535392222132.jpg", 2,
                listOf(Pair("name#fr", "Catégorie Exemple 1 1 1"),
                    Pair("name#en", "Sample Category 1 1 1"),
                    Pair("name#it", "Oh I don't speak Italian category 1 1 1"),
                    Pair("slug#fr", "catg-1-1-1-fr"),
                    Pair("slug#en", "catg-1-1-1-en"),
                    Pair("slug#it", "catg-1-1-1-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 111</h1>"),
                    Pair("description#en", "<h1>Sample Category 111</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 111</h1>"),), "90101"))
            categoryRepository.save(Category("catg-sample-1-1-2", "示例类别1-1-2", 3, "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232732551/22e88208-85d5-4ff7-9740-8ef39546df98.jpg", 3,
                listOf(Pair("name#fr", "Catégorie Exemple 112"),
                    Pair("name#en", "Sample Category 112"),
                    Pair("name#it", "Oh I don't speak Italian category 112"),
                    Pair("slug#fr", "catg-1-1-2-fr"),
                    Pair("slug#en", "catg-1-1-2-en"),
                    Pair("slug#it", "catg-1-1-2-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 112</h1>"),
                    Pair("description#en", "<h1>Sample Category 112</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 112</h1>"),), "90102"))
            categoryRepository.save(Category("catg-sample-2-1", "示例类别2-1", 2, "https://woo-imgs.apeprogrammer.com/images/upload/2021/1/22/232651139/b3df9ba2-06a8-4ea0-a766-5e3402fbcd06.png", 6,
                listOf(Pair("name#fr", "Catégorie Exemple 21"),
                    Pair("name#en", "Sample Category 21"),
                    Pair("name#it", "Oh I don't speak Italian category 21"),
                    Pair("slug#fr", "catg-2-1-fr"),
                    Pair("slug#en", "catg-2-1-en"),
                    Pair("slug#it", "catg-2-1-it"),
                    Pair("description#fr", "<h1>Catégorie Exemple 21</h1>"),
                    Pair("description#en", "<h1>Sample Category 21</h1>"),
                    Pair("description#it", "<h1>Oh I don't speak Italian category 21</h1>"),), "80100"))
        }

        // add pdt attributes
        if (pdtAttrRepo.findAll().isEmpty()) {
            pdtAttrRepo.save(PAttr("Name", true, Type.TEXT, true, "产品名，必填", listOf(true.toString()))) // name, ex: My Product Name
            pdtAttrRepo.save(PAttr("Published", true, Type.SELECT, true, "发布状态，1 for 发布, 0 for 私密, -1 for 草稿.", listOf("-1", "0", "1"))) // status, ex: 1
            pdtAttrRepo.save(PAttr("Visibility in catalog", true, Type.SELECT, false, "可见度: visible, catalog, search, hidden", listOf("visible", "catalog", "search", "hidden"))) // catalog_visibility, ex: visible
            pdtAttrRepo.save(PAttr("Is featured?", true, Type.BOOLEAN, false, "是否推荐产品", null)) // featured, ex: 1
            pdtAttrRepo.save(PAttr("Short description", true, Type.TEXT, false, "短描述", null)) // short_description, ex: This is a product.
            pdtAttrRepo.save(PAttr("Description", true, Type.RICH_TEXT, true, "描述", null)) // description, ex: This is more information about a product.
            pdtAttrRepo.save(PAttr("Regular price", true, Type.NUMBER, true, "价格", listOf(true.toString(), "0"))) // regular_price, ex: 24.99
            pdtAttrRepo.save(PAttr("Sale price", true, Type.NUMBER, true, "促销价格", listOf(false.toString(), "0"))) // sale_price, ex: 20.99
            pdtAttrRepo.save(PAttr("Date sale price starts", true, Type.DATE, true, "促销开始时间，填写日期或留空，ex: 2013-06-07 10:53:15", null)) // date_on_sale_from, ex: 2013-06-07 10:53:15
            pdtAttrRepo.save(PAttr("Date sale price ends", true, Type.DATE, true, "促销结束时间", null)) // date_on_sale_to, ex: 2013-06-07 10:53:15
            pdtAttrRepo.save(PAttr("Images", true, Type.IMAGE_SET, false, "更多的图片", null)) // image_id / gallery_image_ids, ex: http://somewhere.com/image.jpg, http://somewhere.com/image2.jpg
            pdtAttrRepo.save(PAttr("Tax status", true, Type.SELECT, true, "是否可税: taxable, shipping, none", listOf("taxable", "shipping", "none"))) // tax_status, ex: taxable
            pdtAttrRepo.save(PAttr("Tax class", true, Type.TEXT, true, "税类", null)) // tax_class, ex: standard
            pdtAttrRepo.save(PAttr("In stock?", false, Type.BOOLEAN, true, "是否有库存", null)) // stock_status, ex: 1
            pdtAttrRepo.save(PAttr("Stock", false, Type.NUMBER, true, "库存。填入数字来开启库存管理，空白则不开启库存管理。 parent can be used for variations", listOf(false.toString(), "0"))) // manage_stock / stock_quantity, ex: 20
            pdtAttrRepo.save(PAttr("Low stock amount", false, Type.NUMBER, true, "低库存阈值，填入数字或留空", listOf(false.toString(), "0"))) // low_stock_amount, ex: 3
            pdtAttrRepo.save(PAttr("Backorders allowed?", false, Type.SELECT, true, "允许缺货下单。1 for 允许, 0 for 不允许, notify for 显示有库存时提醒按钮", listOf("1", "0", "notify"))) // backorders, ex: 1
            pdtAttrRepo.save(PAttr("Sold individually?", false, Type.BOOLEAN, false, "是否只允许一单买一件", null)) // sold_individually, ex: 1
            pdtAttrRepo.save(PAttr("Weight (kg)", false, Type.TEXT, true, "重量，填入数字", null)) // weight, ex: 100
            pdtAttrRepo.save(PAttr("Length (cm)", false, Type.TEXT, true, "长，填入数字", null)) // length, ex: 20
            pdtAttrRepo.save(PAttr("Width (cm)", false, Type.TEXT, true, "宽，填入数字", null)) // width, ex: 20
            pdtAttrRepo.save(PAttr("Height (cm)", false, Type.TEXT, true, "高，填入数字", null)) // height, ex: 20
            pdtAttrRepo.save(PAttr("Allow customer reviews?", false, Type.BOOLEAN, false, "是否允许品论", null)) // reviews_allowed, ex: 1
            pdtAttrRepo.save(PAttr("Tags", true, Type.TEXT, false, "标签，ex: Tag 1, Tag 2", null)) // tag_ids, ex: Tag 1, Tag 2
            pdtAttrRepo.save(PAttr("Shipping class", true, Type.TEXT, true, "配送方式类别", null)) // shipping_class_id, ex: Name
            pdtAttrRepo.save(PAttr("Upsells", true, Type.TEXT, false, "上级销售推荐产品。Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.", null)) // upsell_ids, ex: id:100, id:101, SKU-1, SKU-2
            pdtAttrRepo.save(PAttr("Cross-sells", true, Type.TEXT, false, "交叉销售推荐产品。Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.", null)) // cross_sell_ids, ex: id:100, id:101, SKU-1, SKU-2
            pdtAttrRepo.save(PAttr("Purchase Note", true, Type.TEXT, false, "购买时显示的信息", null)) // purchase_note, ex: Thanks for buying it buddy.
            pdtAttrRepo.save(PAttr("Button text", true, Type.TEXT, false, "购买按钮上的文本", null)) // button_text, ex: Buy on the WordPress swag store!
            // pdtAttrRepo.save(PAttr("ID", true, AttrType.BOOLEAN, "Defining this will overwrite data for that ID on import.")) // id, ex: 100
            // pdtAttrRepo.save(PAttr("SKU", false, Type.TEXT, "仓库管理代号，必填，ex: my-sku")) // sku, ex: my-sku
            // pdtAttrRepo.save(PAttr("Categories", true, Type.TEXT, "所属类别。CSV list of categories. > used for hierarchy.")) // category_ids, ex: Category 1, Category 1 > Category 2
            // pdtAttrRepo.save(PAttr("Type", false, Type.TEXT, false, "产品类型，必须为以下值: simple, variable, grouped, external, variation, virtual, downloadable. 支持多个值.")) // type, ex: simple, variation, virtual
            // pdtAttrRepo.save(PAttr("Parent", false, Type.TEXT, true, "父级产品。 Used for variations. Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.", null)) // parent_id, ex: id:100, SKU-1
            // pdtAttrRepo.save(PAttr("Grouped products", true, Type.TEXT, false, "分组产品。List of IDs. Can be just a numeric ID e.g. id:100 or a SKU. Export will use SKU when possible.", null)) // children, ex: id:100, id:101, SKU-1, SKU-2
            // pdtAttrRepo.save(PAttr("External URL", true, AttrType.BOOLEAN, "Product external URL.")) // product_url, ex: https://mercantile.wordpress.org/product/wordpress-pennant/
            // pdtAttrRepo.save(PAttr("Position", true, AttrType.BOOLEAN, "Menu order, used for sorting.")) // menu_order, ex: 1
            // pdtAttrRepo.save(PAttr("Download limit", true, AttrType.BOOLEAN, "n/a or a limit.")) // download_limit, ex: 1
            // pdtAttrRepo.save(PAttr("Download expiry days", true, AttrType.BOOLEAN, "n/a or a day limit.")) // download_expiry, ex: 1
        }

        // add products
        if (productRepository.findAll().isEmpty()) {
            productRepository.save(
                Product(
                    "sku-1", ProductType.Simple, null,"示例产品1", "https://http.cat/508", 0, setOf(5, 6), listOf(
                        Pair("name#fr", "Produit Exemple 1"),
                        Pair("name#en", "Sample Product 1"),
                        Pair("name#it", "Oh I don't speak Italian product 1"),
                    ), null
                )
            )
            productRepository.save(Product("sku-2", ProductType.Simple, null, "示例产品2", null, 1, setOf(6), emptyList(), null))
            productRepository.save(Product("sku-3", ProductType.Simple, null,"示例产品3", null, 2, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-4", ProductType.Simple, null, "示例产品3-1",  null, 3, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-5", ProductType.Simple, null,"示例产品3-2", null, 4, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-6", ProductType.Simple, null,"示例产品3-3", null, 5, setOf(2), emptyList(), null))

            productRepository.save(Product("sku-var-1", ProductType.Variable, null,"示例产品var1", null, 6, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-var-1-1", ProductType.Variation, "sku-var-1","示例产品var1-1", null, 6, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-var-1-2", ProductType.Variation, "sku-var-1","示例产品var1-2", null, 6, setOf(2), emptyList(), null))
            productRepository.save(Product("sku-var-1-3", ProductType.Variation, "sku-var-1","示例产品var1-3", null, 6, setOf(2), emptyList(), null))
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
