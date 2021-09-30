import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Category} from '../../interface/Category';
import {Settings} from '../../interface/Settings';
import {AttributeValueType} from '../../enumeration/AttributeValueType';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../service/alert.service';
import {CategoryService} from '../../service/category.service';
import {SettingsService} from '../../service/settings.service';
import {NGXLogger} from 'ngx-logger';
import {CategoriesComponent} from '../categories/categories.component';
import {ProductService} from '../../service/product.service';
import {Product} from '../../interface/Product';
import {UploadFileDialog} from '../../component/upload-file/upload-file-dialog.component';
import {ProductType} from '../../enumeration/ProductType';
import {MediaMatcher} from '@angular/cdk/layout';
import {VariationAttributeService} from '../../service/variation-attribute.service';
import {VariationAttribute} from '../../interface/VariationAttribute';
import {VariationConfiguration} from '../../interface/VariationConfiguration';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Tool} from '../../util/Tool';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  categories: Category[] = []
  categoryIdMap: Map<number, Category> = new Map<number, Category>()
  products: Product[] = []
  productIdMap: Map<number, Product> = new Map<number, Product>()
  selectedProduct: Product = null
  uncategorized: Product[] = []
  variationAttributes: VariationAttribute[] = null

  categorySelectTree: Map<string, number> = new Map<string, number>()
  categoryIdToProductMap: Map<number, Product[]> = new Map<number, Product[]>() // catg pdt -> [pdt id, ...], indicate pdts belongs to a catg
  settings: Settings
  editingNewProduct = false;
  currentAttr = ''
  varConfValueOptions: string[] = []

  TEXT = AttributeValueType.TEXT
  NUMBER = AttributeValueType.NUMBER
  IMAGE = AttributeValueType.IMAGE
  RICH_TEXT = AttributeValueType.RICH_TEXT
  IMAGE_SET = AttributeValueType.IMAGE_SET
  BOOLEAN = AttributeValueType.BOOLEAN
  SELECT = AttributeValueType.SELECT
  DATE = AttributeValueType.DATE

  SIMPLE = ProductType.Simple
  Variable = ProductType.Variable
  Variation = ProductType.Variation

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private catgApi: CategoryService,
    private pdtApi: ProductService,
    private settingsService: SettingsService,
    private variationAttributeService: VariationAttributeService,
    private logger: NGXLogger,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 700px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  async ngAfterViewInit() {
    try {
      this.settings = await this.settingsService.getSettings()
    } catch (error) {
      this.logger.error('Can not load settings')
      this.alertService.error('加载配置失败')
    }

    await this.loadData()
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
          CategoriesComponent.fillCategoryTree(c, this.categorySelectTree, '')
        })
        this.categoryIdMap = this.buildCategoryIdMap(this.categories)
      }

      this.variationAttributes = await this.variationAttributeService.getVariationAttributesPromise()

      this.products = await this.pdtApi.getProducts()
      this.orderVariableProduct(this.products)

      const categoryIdToProductMapTmp = new Map<number, Product[]>()
      categoryIdToProductMapTmp.set(-1, [])

      for (const pdt of this.products) {
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

      this.uncategorized = this.categoryIdToProductMap.get(-1)

      if (this.selectedProduct) {
        this.selectedProduct = this.productIdMap.get(this.selectedProduct.id) // found if created/updated pdt, not found if deleted pdt
        if (this.selectedProduct) {
          this.selectedProduct.matListItemSelected = true
        }
      }

    } catch (error) {
      this.logger.error(error)
      this.alertService.error('出现错误。')
    }
  }

  orderVariableProduct(pdts: Product[]) {
    for (let i = 0; i < pdts.length; i++) {
      const pdt = pdts[i]
      if (pdt.type == ProductType.Variation && pdt.parent && pdt.parent.length) {
        const iParent = pdts.findIndex(p => p.sku == pdt.parent)
        if (iParent > -1) {
          Tool.arrayMove(pdts, i, iParent + 1)
          if (iParent > i) {
            i--
          }
        }
      }
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
    if (this.selectedProduct) {
      this.selectedProduct.matListItemSelected = false
    }
    this.selectedProduct = pdt
    this.selectedProduct.matListItemSelected = true
    if (this.selectedProduct.type == this.Variable || this.selectedProduct.type == this.Variation) {
      if (!this.selectedProduct.variationConfigurations) {
        this.selectedProduct.variationConfigurations = []
      }

      if (this.selectedProduct.type == this.Variation) {
        this.selectedProductParentUpdateEvent(this.selectedProduct.parent)
      }
    }
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

    // check variation attribute fields
    // - check empty
    if (pdt.variationConfigurations.find(vC => !vC.attributeName || vC.attributeName.length == 0)) {
      this.alertService.error('存在未选择的产品属性变量')
      return
    }
    if (pdt.variationConfigurations.find(vC => !vC.attributeValues || vC.attributeValues.length == 0)) {
      this.alertService.error('存在无可选值的产品属性变量')
      return
    }

    // - check duplicates
    const names = pdt.variationConfigurations.map(vC => vC.attributeName)
    if ([...new Set(names)].length < names.length) {
      this.alertService.error('存在重复的产品属性变量')
      return
    }

    if (pdt.variationConfigurations.filter(vC => {
      if ([...new Set(vC.attributeValues)].length < vC.attributeValues.length) {
        return true
      }
    }).length > 0) {
      this.alertService.error('存在有重复可选值的产品属性变量')
      return
    }

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

  getProductImageSrc(pdt: Product): string {
    const src = pdt.image
    if (src && src.length) {
      return src
    }

    return 'https://http.cat/404'
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
    const realName = name.split('#')[0]
    const showLabel = this.currentAttr !== realName
    this.currentAttr = realName
    return showLabel
  }

  getDescriptionOfProductAttr(attr: string): string {
    return this.settings.productAttributes.find(it => it.name === attr).description
  }

  getAttrType(attrName: string) {
    return this.getProductAttributeByName(attrName).valueType
  }

  getOptionsOfSelectAttr(attrName: string) {
    return this.getProductAttributeByName(attrName).options
  }

  addVariableConfigurationOnClick() {
    this.selectedProduct.variationConfigurations.push({attributeName: '', attributeValues: []})
  }

  removeVariableConfigurationOnClick() {
    this.selectedProduct.variationConfigurations.pop()
  }

  varConfValueAddOnClick(varConf: VariationConfiguration, event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    const value = event.option.value

    // variable product -> select all allowed options
    if (this.selectedProduct.type == this.Variable) {
      if (varConf.attributeValues.indexOf(value) >= 0) {
        this.alertService.error('已存在 ' + value)
        return
      }
      varConf.attributeValues.push(value)
    }
    // variation product -> select ONE option
    else if (this.selectedProduct.type == this.Variation) {
      varConf.attributeValues = [value]
    }

    this.varConfValueOptions = []
    input.value = ''
  }

  varConfValueRemoveOnClick(varConf: VariationConfiguration, value: string) {
    varConf.attributeValues = varConf.attributeValues.filter(v => v != value)
  }

  getVarConfValueOptions(attributeName: string) {
    if (!attributeName || attributeName.length == 0) return

    // variable product -> give all options
    if (this.selectedProduct.type == this.Variable) {
      return this.variationAttributes.find(attr => attr.name == attributeName).terms.map(t => t.name)
    }

    // variation product -> give it's parent's configured options
    if (this.selectedProduct.type == this.Variation) {
      const parent = this.products.find(p => p.sku == this.selectedProduct.parent) // not very optimal, because this is called in *ngFor
      if (!parent) {
        this.logger.error('getVarConfValueOptions error, parent SKU ' + this.selectedProduct.parent + ' not found')
        return
      }

      const varConf = parent.variationConfigurations.find(vC => vC.attributeName == attributeName)
      if (!varConf) {
        this.logger.error('getVarConfValueOptions error, varConf name ' + attributeName + ' not found in parent\'s variationConfigurations')
        return
      }

      return varConf.attributeValues
    }
  }

  filterVarConfValueOptions(values: string[], input: KeyboardEvent) {
    const val = (input?.currentTarget as HTMLInputElement)?.value
    if (!val || !val.length) {
      this.varConfValueOptions = values
    } else {
      this.varConfValueOptions = values.filter(v => v.indexOf(val) > -1)
    }
  }

  // selected product's parent is Updated, find the parent and update the variation attribute name field
  selectedProductParentUpdateEvent(parentSku: string) {
    const parent = this.products.find(p => p.sku == parentSku)
    if (!parent) {
      this.alertService.error('父产品SKU不存在')
      return
    }

    // if selected pdt's var conf is not set, init it with pdt's parent's var conf
    if (!this.selectedProduct.variationConfigurations || this.selectedProduct.variationConfigurations.length == 0) {
      this.selectedProduct.variationConfigurations = parent.variationConfigurations.map(vC => {
        return {attributeName: vC.attributeName, attributeValues: []}
      })
    }
    // if selected pdt's var conf length is > parent's var conf length (var conf is removed from parent), remove the extra var conf
    else if (this.selectedProduct.variationConfigurations.length > parent.variationConfigurations.length) {
      this.selectedProduct.variationConfigurations =
        this.selectedProduct.variationConfigurations.filter(
          c => parent.variationConfigurations.find(cP => cP.attributeName == c.attributeName)
        )
    }
    // if selected pdt's var conf length is < parent's var conf length (new var conf is added to parent)add the missing var conf
    else if (this.selectedProduct.variationConfigurations.length < parent.variationConfigurations.length) {
      parent.variationConfigurations
        .filter(cP => !this.selectedProduct.variationConfigurations.find(c => cP.attributeName == c.attributeName))
        .forEach(cP => this.selectedProduct.variationConfigurations.push({
          attributeName: cP.attributeName,
          attributeValues: []
        }))
    }

  }

  private getProductAttributeByName(attrName: string) {
    return this.settings.productAttributes.find(attr => attr.name === attrName)
  }

  private saveNewProduct(pdt: Product) {
    this.pdtApi.saveNewProduct(pdt).subscribe(
      async (res) => {
        this.editingNewProduct = false
        await this.loadData()
        this.selectedProduct = this.products.find(p => p.id == Number(res))
        this.selectedProduct.matListItemSelected = true;
        this.alertService.success('创建成功。')
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
    this.alertService.success('操作成功。')
  }

  private handleError = error => {
    this.logger.error(error)
    this.alertService.error('出现错误。')
  }
}
