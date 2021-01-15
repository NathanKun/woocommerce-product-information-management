import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core'
import {Category} from "../../interface/Category"
import {CategoryService} from "../../service/category.service"
import {NGXLogger} from "ngx-logger"
import {AlertService} from "../../service/alert.service"
import {SettingsService} from "../../service/settings.service"
import {CategoryAttribute, PimLocale, Settings} from "../../interface/Settings"

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements AfterViewInit {
  @ViewChildren(".category-link") categoryLinks: QueryList<ElementRef>
  categories: Category[] = []
  selectedCategory: Category = null

  categorySelectTree: Map<string, number>
  settings: Settings

  constructor(
    private alertService: AlertService,
    private api: CategoryService,
    private settingsService: SettingsService,
    private logger: NGXLogger
  ) {
  }

  ngAfterViewInit(): void {
    this.categoryLinks.changes.subscribe(ele => this.categoryLinks = ele)

    this.settingsService.getSettings().subscribe(
      res => this.settings = res
    )

    this.loadData()
  }

  loadData() {
    this.api.getCategories().subscribe(
      res => {
        this.categories = res
        this.logger.debug(this.categories)

        this.categorySelectTree = new Map<string, number>()
        this.categories.forEach(c => this.fillCategoryTree(c, this.categorySelectTree, ""))
        this.logger.debug([...this.categorySelectTree.keys()])
      },
      error => {
        this.logger.error(error)
        this.alertService.error("出现错误。")
      }
    )
  }

  editOnClick(event: Category) {
    this.selectedCategory = event
  }

  fillCategoryTree(catg: Category, tree: Map<string, number>, level: string) {
    tree.set(level + " " + catg.name, catg.id)

    if (catg.children) {
      for (let child of catg.children) {
        this.fillCategoryTree(child, tree, level + "--")
      }
    }
  }

  buildLocalAttrName(attr: CategoryAttribute, locale: PimLocale) {
    return attr.name + "#" + locale.countryCode
  }

  saveNewCategory(catg: Category) {
    this.api.saveNewCategory(catg).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  updateCategory(catg: Category) {
    this.api.updateCategory(catg).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  deleteCategory(catg: Category) {
    this.api.deleteCategory(catg).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  private handleSuccess = () => {
    this.loadData()
  }

  private handleError = error => {
    this.logger.error(error)
    this.alertService.error("出现错误。")
  }
}
