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

  constructor(
    private catgApi: CategoryService,
    private pdtApi: ProductService,
    private settingsService: SettingsService
  ) {

  }

  async ngAfterViewInit() {
    this.settings = await this.settingsService.getSettings()
    this.categories = await this.catgApi.getPlainCategoriesPromise()
    this.products = await this.pdtApi.getProducts()

    this.categoryNoImageCount = this.categories.filter(c => !c.image).length
    this.productNoImageCount = this.products.filter(c => !c.image).length

    this.settings.pimLocales.forEach(l => {
      const catgNoNameCount = this.categories.filter(this.filterNoValue('name', l.languageCode)).length
      this.categoryNoNameCount.set(l.name, catgNoNameCount)

      const catgNoDescCount = this.categories.filter(this.filterNoValue('description', l.languageCode)).length
      this.categoryNoDescCount.set(l.name, catgNoDescCount)

      const pdtNoNameCount = this.products.filter(this.filterNoValue('name', l.languageCode)).length
      this.productNoNameCount.set(l.name, pdtNoNameCount)

      const pdtNoDescCount = this.products.filter(this.filterNoValue('description', l.languageCode)).length
      this.productNoDescCount.set(l.name, pdtNoDescCount)
    })
  }

  private filterNoValue(name: string, languageCode: string) {
    return (it: Category | Product) => {
      const desc = it.attributes.find(a => a.name = `${name}#${languageCode}`)
      return !desc || !desc.value
    }
  }

}
