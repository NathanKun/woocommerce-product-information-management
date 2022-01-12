import {AfterViewInit, Component} from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {ProductService} from '../../service/product.service';
import {SettingsService} from '../../service/settings.service';
import {Category} from '../../interface/Category';
import {Product} from '../../interface/Product';
import {Settings} from '../../interface/Settings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  categories: Category[] = []
  products: Product[] = []
  settings: Settings

  categoryNoImageCount = 0
  categoryNoNameCount = new Map<string, number>()
  categoryNoDescCount = new Map<string, number>()

  productNoImageCount = 0
  productNoNameCount = new Map<string, number>()
  productNoDescCount = new Map<string, number>()

  loading = true

  constructor(
    private catgApi: CategoryService,
    private pdtApi: ProductService,
    private settingsService: SettingsService
  ) {

  }

  async ngAfterViewInit() {
    this.settings = await this.settingsService.getSettings()
    this.categories = await this.catgApi.getPlainCategoriesPromise()
    this.products = await this.pdtApi.getProducts(false)

    this.categoryNoImageCount = this.categories.filter(c => !c.image).length
    this.productNoImageCount = this.products.filter(c => !c.image).length

    this.settings.pimLocales.forEach(l => {
      let catgNoNameCount = 0
      let catgNoDescCount = 0
      let pdtNoNameCount = 0
      let pdtNoDescCount = 0

      this.categories.forEach(c => {
        catgNoNameCount += this.isNoValue(c, 'Name', l.languageCode) ? 1 : 0
        catgNoDescCount += this.isNoValue(c, 'Description', l.languageCode) ? 1 : 0
      })

      this.products.forEach(p => {
        pdtNoNameCount += this.isNoValue(p, 'Name', l.languageCode) ? 1 : 0
        pdtNoDescCount += this.isNoValue(p, 'Description', l.languageCode) ? 1 : 0
      })

      this.categoryNoNameCount.set(l.name, catgNoNameCount)
      this.categoryNoDescCount.set(l.name, catgNoDescCount)
      this.productNoNameCount.set(l.name, pdtNoNameCount)
      this.productNoDescCount.set(l.name, pdtNoDescCount)
    })

    this.loading = false
  }

  private isNoValue(it: Product | Category, attrName: string, languageCode: string) {
    let attr = it.attributes.find(a => a.name == `${attrName}#${languageCode}`)
    return !attr || !attr.value
  }

}
