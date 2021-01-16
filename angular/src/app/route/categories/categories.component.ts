import {AfterViewInit, Component, ElementRef, QueryList, ViewChildren} from '@angular/core'
import {Category} from "../../interface/Category"
import {CategoryService} from "../../service/category.service"
import {NGXLogger} from "ngx-logger"
import {AlertService} from "../../service/alert.service"
import {SettingsService} from "../../service/settings.service"
import {Settings} from "../../interface/Settings"
import {FormControl, Validators} from "@angular/forms";

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
  editingNewCategory = false;

  codeFormControl = new FormControl("", [Validators.required, Validators.pattern(/[a-z\-]+/)])

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
        this.categorySelectTree.set("", null)
        this.categories.forEach(c => this.fillCategoryTree(c, this.categorySelectTree, ""))
        this.logger.debug([...this.categorySelectTree.keys()])

        // refresh the select category
        if (this.selectedCategory != null) {
          let found = false
          for (let catg of this.categories) {
            const foundCatg = this.searchCategoryTree(catg, this.selectedCategory.id)
            if (foundCatg) {
              this.selectedCategory = foundCatg
              found = true
              break;
            }
          }

          if (!found) {
            this.selectedCategory = null
          }
        }
      },
      error => {
        this.logger.error(error)
        this.alertService.error("出现错误。")
      }
    )
  }

  editOnClick(event: Category) {
    this.editingNewCategory = false
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

  addCategoryOnClick() {
    this.editingNewCategory = true
    this.selectedCategory = this.api.createNewCategory()
  }

  saveButtonOnclick(catg: Category) {
    if (catg.id === catg.parentId) {
      this.alertService.error("父类别不能为自身")
      return
    }

    if (this.editingNewCategory) {
      this.saveNewCategory(catg)
    } else {
      this.updateCategory(catg)
    }
  }

  deleteCategory(catg: Category) {
    this.api.deleteCategory(catg).subscribe(
      this.handleSuccess, this.handleError
    )
  }

  keepOrderSort = (a, b) => a

  private saveNewCategory(catg: Category) {
    this.api.saveNewCategory(catg).subscribe(
      (res) => {
        this.alertService.success("创建成功。")
        this.editingNewCategory = false
        // set the returned created catg's id to selected catg, loadData fun will use the id to replace selectedCategory obj with a created one
        this.selectedCategory.id = Number(res)
        console.log(this.selectedCategory.id)
        this.loadData()
      }, this.handleError
    )
  }

  private updateCategory(catg: Category) {
    this.api.updateCategory(catg).subscribe(
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

  private searchCategoryTree(category: Category, id: number) {
    if (category.id === id) {
      return category;
    } else if (category.children != null) {
      let result = null;
      for (let i = 0; result == null && i < category.children.length; i++) {
        result = this.searchCategoryTree(category.children[i], id);
      }
      return result;
    }
    return null;
  }
}
