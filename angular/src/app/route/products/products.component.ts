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
import {UploadFileDialog} from "../../component/upload-file/upload-file-dialog.component";
import {ProductType} from "../../enumeration/ProductType";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit {
  categories: Category[] = []
  categoryIdMap: Map<number, Category> = new Map<number, Category>()
  products: Product[] = []
  productIdMap: Map<number, Product> = new Map<number, Product>()
  selectedProduct: Product = null
  uncategorized: Product[] = []

  categorySelectTree: Map<string, number> = new Map<string, number>()
  categoryIdToProductMap: Map<number, Product[]> = new Map<number, Product[]>() // catg pdt -> [pdt id, ...], indicate pdts belongs to a catg
  settings: Settings
  editingNewProduct = false;
  currentAttr = ""

  TEXT = AttributeValueType.TEXT
  IMAGE = AttributeValueType.IMAGE
  RICH_TEXT = AttributeValueType.RICH_TEXT
  IMAGE_SET = AttributeValueType.IMAGE_SET
  BOOLEAN = AttributeValueType.BOOLEAN

  SIMPLE = ProductType.Simple

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

  private copyCategoriesTmpToCategories(categoriesTmp: Category[], categories: Category[]) {
    const newMap = this.buildCategoryIdMap(categoriesTmp)
    const oldMap = this.buildCategoryIdMap(categories)

    for (const id of newMap.keys()) {
      if (oldMap.has(id)) {
        Object.assign(oldMap.get(id), newMap.get(id))
      } else {
        categories.push(newMap.get(id))
      }
    }
  }

  private buildCategoryIdMap(catgs: Category[]): Map<number, Category> {
    const map = new Map<number, Category>()
    for (const c of catgs) {
      this.buildCategoryIdMapInternal(c, map)
    }
    return map
  }

  private buildCategoryIdMapInternal(c: Category, map: Map<number, Category>) {
    map.set(c.id, c)

    if (c.children && c.children.length) {
      for (const child of c.children) {
        this.buildCategoryIdMapInternal(child, map)
      }
    }
  }

  async loadData() {
    try {
      if (this.categories == null || this.categories.length === 0) {
        this.categories = await this.catgApi.getCategoriesPromise()
        this.categorySelectTree = new Map<string, number>() // catg name -> catg id
        this.categories.forEach(c => {
          CategoriesComponent.fillCategoryTree(c, this.categorySelectTree, "")
        })
        this.categoryIdMap = this.buildCategoryIdMap(this.categories)
      }

      this.products = await this.pdtApi.getProducts()

      const categoryIdToProductMapTmp = new Map<number, Product[]>()

      for (const pdt of this.products) {
        categoryIdToProductMapTmp.set(-1, [])
        // fill categoryIdToProductIdMap
        if (pdt.categoryIds && pdt.categoryIds.length) {
          for (const catgId of pdt.categoryIds) {
            if (!categoryIdToProductMapTmp.has(catgId)) {
              categoryIdToProductMapTmp.set(catgId, [])
            }
            categoryIdToProductMapTmp.get(catgId).push(pdt)
          }
        } else {
          categoryIdToProductMapTmp.get(-1).push(pdt)
        }

        // sort categoryIdToProductMap with category menu order
        this.categoryIdToProductMap = new Map([...categoryIdToProductMapTmp.entries()].sort(
          (a, b) => {
            let catgA = this.categoryIdMap.get(a[0])?.menuOrder
            let catgB = this.categoryIdMap.get(b[0])?.menuOrder

            if (catgA == null) catgA = -1
            if (catgB == null) catgB = -1

            if (catgA === -1) return -1
            if (catgB === -1) return 1

            return catgA > catgB ? 1 : catgA < catgB ? -1 : 0
          }
        ));

        // fill productIdMap
        this.productIdMap = new Map<number, Product>()
        for (const pdt of this.products) {
          this.productIdMap.set(pdt.id, pdt)
        }

        const categorizedPdtIds = new Set(([].concat(...Array.from(this.categoryIdToProductMap.values())) as Product[]).map(pdt => pdt.id))
        this.uncategorized = this.products.filter(pdt => !categorizedPdtIds.has(pdt.id))
      }

    } catch (error) {
      this.logger.error(error)
      this.alertService.error("出现错误。")
    }
  }

  moveProductUp(pdt: Product) {
    for (const catgId of pdt.categoryIds) {
      const pdts = this.categoryIdToProductMap.get(catgId)

      let index = 0
      for (const p of pdts) {
        if (p.id === pdt.id) {
          break;
        }
        index++
      }

      if (index > 0) {
        const indexMinusOne = pdts[index - 1]
        pdts[index - 1] = pdt
        pdts[index] = indexMinusOne
      }
    }

    this.pdtApi.resetMenuOrders(this.categoryIdToProductMap)
    this.pdtApi.saveMenuOrders(this.products).subscribe()
  }

  moveProductDown(pdt: Product) {
    for (const catgId of pdt.categoryIds) {
      const pdts = this.categoryIdToProductMap.get(catgId)

      let index = 0
      for (const p of pdts) {
        if (p.id === pdt.id) {
          break;
        }
        index++
      }

      if (index < pdts.length - 1) {
        const indexPlusOne = pdts[index + 1]
        pdts[index + 1] = pdt
        pdts[index] = indexPlusOne
      }
    }

    this.pdtApi.resetMenuOrders(this.categoryIdToProductMap)
    this.pdtApi.saveMenuOrders(this.products).subscribe()
  }

  editOnClick(pdt: Product) {
    this.editingNewProduct = false
    this.selectedProduct = pdt
  }

  addProductOnClick() {
    this.editingNewProduct = true
    this.selectedProduct = this.pdtApi.createNewProduct()
  }

  saveButtonOnclick(pdt: Product) {
    // TODO: check attributes
    /*if (xxx) {
      this.alertService.error("xxx")
      return
    }*/

    if (this.editingNewProduct) {
      this.saveNewProduct(pdt)
    } else {
      this.updateProduct(pdt)
    }
  }

  deleteProduct(pdt: Product) {
    this.pdtApi.deleteProduct(pdt).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  keepOrderSort = (a, b) => a

  getProductImageSrc(pdt: Product): string {
    const src = pdt.image
    if (src && src.length) {
      return src
    }

    return "https://http.cat/404"
  }

  uploadProductImage() {
    const dialogRef = this.dialog.open(UploadFileDialog, {
      width: '888px',
      data: {multiFiles: false}
    });

    dialogRef.afterClosed().subscribe((url: string[]) => {
      if (url && url.length) {
        this.selectedProduct.image = url[0]
      }
    });
  }

  nextAttrShowLabel(name: string): boolean {
    const realName = name.split("#")[0]
    const showLabel = this.currentAttr !== realName
    this.currentAttr = realName
    return showLabel
  }

  getDescriptionOfProductAttr(attr: string): string {
    return this.settings.productAttributes.find(it => it.name === attr).description
  }

  shouldShowOnVariationProductType(attr: string): boolean {
    return this.settings.productAttributes.find(it => it.name === attr.split("#")[0]).variation
  }

  private saveNewProduct(pdt: Product) {
    this.pdtApi.saveNewProduct(pdt).subscribe(
      async (res) => {
        this.alertService.success("创建成功。")
        this.editingNewProduct = false
        // set the returned created pdt's id to selected pdt, loadData fun will use the id to replace selectedProduct obj with a created one
        this.selectedProduct.id = Number(res)
        await this.loadData()
      }, this.handleError
    )
  }

  private updateProduct(pdt: Product) {
    this.pdtApi.updateProduct(pdt).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  private handleSuccess = async () => {
    await this.loadData()
    this.alertService.success("操作成功。")
  }

  private handleError = error => {
    this.logger.error(error)
    this.alertService.error("出现错误。")
  }
}
