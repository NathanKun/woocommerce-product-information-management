import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy} from '@angular/core'
import {Category} from "../../interface/Category"
import {CategoryService} from "../../service/category.service"
import {NGXLogger} from "ngx-logger"
import {AlertService} from "../../service/alert.service"
import {SettingsService} from "../../service/settings.service"
import {Settings} from "../../interface/Settings"
import {MatDialog} from "@angular/material/dialog";
import {UploadFileDialog} from "../../component/upload-file/upload-file-dialog.component";
import {AttributeValueType} from "../../enumeration/AttributeValueType";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements AfterViewInit, OnDestroy {
  categories: Category[] = []
  selectedCategory: Category = null

  categorySelectTree: Map<string, number>
  settings: Settings
  editingNewCategory = false;
  currentAttr = ""

  TEXT = AttributeValueType.TEXT
  IMAGE = AttributeValueType.IMAGE
  RICH_TEXT = AttributeValueType.RICH_TEXT
  IMAGE_SET = AttributeValueType.IMAGE_SET
  BOOLEAN = AttributeValueType.BOOLEAN

  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
    private api: CategoryService,
    private settingsService: SettingsService,
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
      this.logger.error("Can not load settings")
      this.alertService.error("加载配置失败")
    }

    this.loadData()
  }

  loadData() {
    this.api.getCategories().subscribe(
      res => {
        this.categories = res
        this.logger.debug(this.categories)

        this.categorySelectTree = new Map<string, number>()
        this.categorySelectTree.set("", null)
        this.categories.forEach(c => CategoriesComponent.fillCategoryTree(c, this.categorySelectTree, ""))
        this.logger.debug([...this.categorySelectTree.keys()])

        // refresh the select category
        if (this.selectedCategory != null) {
          let found = false
          for (let catg of this.categories) {
            const foundCatg = CategoriesComponent.searchCategoryInTree(catg, this.selectedCategory.id)
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

  static fillCategoryTree(catg: Category, tree: Map<string, number>, level: string) {
    tree.set(level + " " + catg.name, catg.id)

    if (catg.children) {
      for (let child of catg.children) {
        CategoriesComponent.fillCategoryTree(child, tree, level + "--")
      }
    }
  }

  static searchCategoryInTree(category: Category, id: number) {
    if (category.id === id) {
      return category;
    } else if (category.children != null) {
      let result = null;
      for (let i = 0; result == null && i < category.children.length; i++) {
        result = CategoriesComponent.searchCategoryInTree(category.children[i], id);
      }
      return result;
    }
    return null;
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

  getCategoryImageSrc(category: Category): string {
    const src = category.image
    if (src && src.length) {
      return src
    }

    return "https://http.cat/404"
  }

  uploadCategoryImage() {
    const dialogRef = this.dialog.open(UploadFileDialog, {
      width: '888px',
      data: {multiFiles: false}
    });

    dialogRef.afterClosed().subscribe((url: string[]) => {
      if (url && url.length) {
        this.selectedCategory.image = url[0]
      }
    });
  }

  nextAttrShowLabel(name: string): boolean {
    const realName = name.split("#")[0]
    const showLabel = this.currentAttr !== realName
    this.currentAttr = realName
    return showLabel
  }

  getDescriptionOfCategoryAttr(attr: string): string {
    return this.settings.categoryAttributes.find(it => it.name === attr).description
  }

  moveCategoryUp(category: Category) {
    const siblings = this.searchCategorySiblingArrayInTree(this.categories, category)
    if (siblings) {
      // find index of this catg
      let catgIndex = 0
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].id === category.id) {
          catgIndex = i
        }
      }

      if (catgIndex === 0) {
        this.alertService.error("无法上移，该类别已经是其父类别的所有子类别中的第一个。")
        return
      }

      // move up: swap catgIndex with catgIndex - 1
      const iMinusOne = siblings[catgIndex - 1]
      siblings[catgIndex - 1] = category
      siblings[catgIndex] = iMinusOne

      // reset menu_order attr
      this.api.resetMenuOrders(this.categories)

      // save
      this.api.saveMenuOrders(this.categories).subscribe(
        () => {
          this.alertService.success("上移成功。")
        }, error => {
          this.alertService.error("发生错误，上移失败。")
          this.logger.error(error)
        }
      )

    } else {
      this.logger.warn("Sibling array not found for category id = " + category.id + " name = " + category.name)
      this.alertService.error("发生错误，上移失败。")
    }
  }

  moveCategoryDown(category: Category) {
    const siblings = this.searchCategorySiblingArrayInTree(this.categories, category)
    if (siblings) {
      // find index of this catg
      let catgIndex = 0
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].id === category.id) {
          catgIndex = i
        }
      }

      if (catgIndex === siblings.length - 1) {
        this.alertService.error("无法下移，该类别已经是其父类别的所有子类别中的最后一个。")
        return
      }

      // move down: swap catgIndex with catgIndex + 1
      const iPlusOne = siblings[catgIndex + 1]
      siblings[catgIndex + 1] = category
      siblings[catgIndex] = iPlusOne

      // reset menu_order attr
      this.api.resetMenuOrders(this.categories)

      // save
      this.api.saveMenuOrders(this.categories).subscribe(
        () => {
          this.alertService.success("下移成功。")
        }, error => {
          this.alertService.error("发生错误，下移失败。")
          this.logger.error(error)
        }
      )

    } else {
      this.logger.warn("Sibling array not found for category id = " + category.id + " name = " + category.name)
      this.alertService.error("发生错误，下移失败。")
    }
  }

  getAttrType(attrName: string) {
    return this.settings.categoryAttributes.find(attr => attr.name === attrName).valueType
  }

  private saveNewCategory(catg: Category) {
    this.api.saveNewCategory(catg).subscribe(
      (res) => {
        this.alertService.success("创建成功。")
        this.editingNewCategory = false
        // set the returned created catg's id to selected catg, loadData fun will use the id to replace selectedCategory obj with a created one
        this.selectedCategory.id = Number(res)
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

  private searchCategorySiblingArrayInTree(array: Category[], target: Category): Category[] {
    this.logger.warn("finding ", target.id, " in ", ...array.map(it => it.id))
    const found = array.find(it => it.id === target.id)

    if (found) {
      return array
    } else {
      for (let c of array) {
        if (c.children && c.children.length) {
          const res = this.searchCategorySiblingArrayInTree(c.children, target)
          if (res) {
            return res
          }
        }
      }
    }

    return null
  }
}
