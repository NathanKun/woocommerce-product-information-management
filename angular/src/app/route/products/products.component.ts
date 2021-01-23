import {AfterViewInit, Component} from '@angular/core';
import {Category} from "../../interface/Category";
import {Settings} from "../../interface/Settings";
import {AttributeValueType} from "../../enumeration/AttributeValueType";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../service/alert.service";
import {CategoryService} from "../../service/category.service";
import {SettingsService} from "../../service/settings.service";
import {NGXLogger} from "ngx-logger";
import {CategoriesComponent} from "../categories/categories.component";
import {ProductService} from "../../service/product.service";
import {Product} from "../../interface/Product";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit {
  categories: Category[] = []
  products: Product[] = []
  productIdMap: Map<number, Product> = new Map<number, Product>()
  selectedProduct: Product = null

  categorySelectTree: Map<string, number>
  categoryIdToProductMap: Map<number, Product[]> // catg pdt -> [pdt id, ...], indicate pdts belongs to a catg
  settings: Settings
  editingNewProduct = false;
  currentAttr = ""

  TEXT = AttributeValueType.TEXT
  IMAGE = AttributeValueType.IMAGE
  RICH_TEXT = AttributeValueType.RICH_TEXT
  IMAGE_SET = AttributeValueType.IMAGE_SET
  BOOLEAN = AttributeValueType.BOOLEAN
  CATEGORY = AttributeValueType.CATEGORY

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private catgApi: CategoryService,
    private pdtApi: ProductService,
    private settingsService: SettingsService,
    private logger: NGXLogger
  ) {
  }

  async ngAfterViewInit() {
    try {
      this.settings = await this.settingsService.getSettings()
    } catch (error) {
      this.logger.error("Can not load settings")
      this.alertService.error("加载配置失败")
    }

    await this.loadData()
  }

  async loadData() {
    try {
      this.categories = await this.catgApi.getCategoriesPromise()
      this.categorySelectTree = new Map<string, number>() // catg name -> catg id
      this.categorySelectTree.set("未分类", null)
      this.categories.forEach(c => CategoriesComponent.fillCategoryTree(c, this.categorySelectTree, ""))
      this.logger.debug([...this.categorySelectTree.keys()])

      this.products = await this.pdtApi.getProducts()
      this.logger.debug(this.products)

      for (const pdt of this.products) {
        // fill categoryIdToProductIdMap
        for (const catgId of pdt.categoryIds) {
          if (!this.categoryIdToProductMap.has(catgId)) {
            this.categoryIdToProductMap.set(catgId, [])
          }
          this.categoryIdToProductMap.get(catgId).push(pdt)
        }

        // fill productIdMap
        this.productIdMap.set(pdt.id, pdt)
      }

    } catch (error) {
      this.logger.error(error)
      this.alertService.error("出现错误。")
    }
  }


}
