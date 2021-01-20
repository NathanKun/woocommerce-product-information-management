import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {CategoryAttribute, ProductAttribute, Settings} from "../interface/Settings"
import {environment} from "../../environments/environment"
import {map} from "rxjs/operators"
import {Category, CategoryResponse} from "../interface/Category"
import {SettingsService} from "./settings.service";
import {RestResponse} from "../interface/RestResponse";
import {BaseHttpService} from "./basehttp.service";

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseHttpService {
  private settings: Settings
  private allLocalizedCategoryAttr: CategoryAttribute[] = []
  private allLocalizedProductAttr: ProductAttribute[] = []

  constructor(private http: HttpClient,
              settingsService: SettingsService) {
    super()
    settingsService.$settings.subscribe(
      res => {
        this.settings = res
        this.prepareAttrArrays()
      }
    )
    settingsService.getSettings().then()
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryResponse>(`${environment.api}/categories/`).pipe(
      map(res => {
        if (res.success) {
          const categories = res.data as Category[]
          this.processCategories(categories)
          return this.buildCategoryTree(categories as Category[])
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }

  saveNewCategory(catg: Category): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/categories/`, catg).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  updateCategory(catg: Category): Observable<string> {
    catg = JSON.parse(JSON.stringify(catg))
    delete catg.children

    return this.http.put<RestResponse<string>>(`${environment.api}/categories/`, catg).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deleteCategory(catg: Category): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete',
      `${environment.api}/categories/`,
      this.buildDeleteRequestOption(catg.id)
    ).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  createNewCategory(): Category {
    const catg = {
      code: "",
      name: "",
      attributes: [],
      menuOrder: -1,
      id: -1
    }
    this.processCategory(catg)
    return catg
  }

  processCategories(categories: Category[]) {
    for (let catg of categories) {
      this.processCategory(catg)
    }
  }

  processCategory(catg: Category) {
    // add any attr which not exists in this catg
    for (let attr of this.allLocalizedCategoryAttr) {
      if (catg.attributes.find(it => it.name === attr.name) === undefined) {
        catg.attributes.push({
          name: attr.name,
          value: "",
          type: attr.valueType
        })
      }
    }

    // remove any attr not configured
    catg.attributes = catg.attributes.filter(catg => {
      return this.allLocalizedCategoryAttr.find(attr => attr.name === catg.name) !== undefined
    })
  }

  buildCategoryTree(categories: Category[]): Category[] {
    const list: Category[] = []
    const map = new Map<Number, Category>()

    // put every catg in map
    for (let c of categories) {
      map.set(c.id, c)
    }

    for (let c of categories) {
      // if catg has parent and map has this parent id, push current catg in parent's children
      if (c.parentId && map.has(c.parentId)) {
        const parent = map.get(c.parentId)
        if (parent.children == null) {
          parent.children = []
        }
        parent.children.push(c)
      }
      // else: catg does not have parent or catg has a invalid parent id, put it in list
      else {
        list.push(c)
      }
    }

    return list
  }

  // noinspection DuplicatedCode
  private prepareAttrArrays() {
    // fill allLocalizedCategoryAttr
    this.allLocalizedCategoryAttr = []
    for (let attr of this.settings.categoryAttributes) {
      if (attr.localizable) {
        for (let locale of this.settings.pimLocales) {
          const attrName = attr.name + "#" + locale.countryCode
          this.allLocalizedCategoryAttr.push({
            name: attrName,
            description: attr.description,
            valueType: attr.valueType,
            localizable: attr.localizable,
            id: attr.id
          })
        }
      } else {
        this.allLocalizedCategoryAttr.push({
          name: attr.name,
          description: attr.description,
          valueType: attr.valueType,
          localizable: attr.localizable,
          id: attr.id
        })
      }
    }

    // fill allLocalizedProductAttr
    this.allLocalizedProductAttr = []
    for (let attr of this.settings.productAttributes) {
      if (attr.localizable) {
        for (let locale of this.settings.pimLocales) {
          const attrName = attr.name + "#" + locale.countryCode
          this.allLocalizedProductAttr.push({
            name: attrName,
            description: attr.description,
            valueType: attr.valueType,
            localizable: attr.localizable,
            id: attr.id
          })
        }
      } else {
        this.allLocalizedProductAttr.push({
          name: attr.name,
          description: attr.description,
          valueType: attr.valueType,
          localizable: attr.localizable,
          id: attr.id
        })
      }
    }
  }

}
