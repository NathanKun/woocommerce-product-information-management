import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {CategoryAttribute, Settings} from '../interface/Settings'
import {environment} from '../../environments/environment'
import {map, tap} from 'rxjs/operators'
import {Category, CategoryResponse} from '../interface/Category'
import {SettingsService} from './settings.service';
import {RestResponse} from '../interface/RestResponse';
import {BaseHttpService} from './basehttp.service';
import {Tool} from '../util/Tool';

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseHttpService {
  private settings: Settings
  private allLocalizedCategoryAttr: CategoryAttribute[] = []

  constructor(private http: HttpClient,
              settingsService: SettingsService) {
    super()
    settingsService.$settings.subscribe(
      res => {
        this.settings = res
        this.allLocalizedCategoryAttr = Tool.prepareAttrArrays(this.settings.categoryAttributes, this.settings.pimLocales)
      }
    )
    settingsService.getSettings().then()
  }

  getCategories(): Observable<Category[]> {
    return this.getCategoriesInternal()
  }

  getCategoriesPromise(): Promise<Category[]> {
    return this.getCategoriesInternal().toPromise()
  }

  private getCategoriesInternal(): Observable<Category[]> {
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
      code: '',
      name: '',
      attributes: [],
      menuOrder: -1,
      id: -1,
      ean: '00000'
    }
    Tool.processItemFillAttributes(catg, this.allLocalizedCategoryAttr, this.settings.categoryAttributeOrderMap, this.settings.pimLocaleOrderMap)
    return catg
  }

  processCategories(categories: Category[]) {
    for (let catg of categories) {
      Tool.processItemFillAttributes(catg, this.allLocalizedCategoryAttr, this.settings.categoryAttributeOrderMap, this.settings.pimLocaleOrderMap)
    }

    this.processCategoryOrderWithMenuOrder(categories)
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

  resetMenuOrders(categories: Category[]) {
    let order = 0

    for (let c of categories) {
      order = this.resetMenuOrdersInternal(c, order)
    }
  }

  saveMenuOrders(categories: Category[]): Observable<string> {
    const data = []
    this.buildMenuOrderData(data, categories)

    return this.http.put<RestResponse<string>>(`${environment.api}/categories/order`, {data: data}).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  private processCategoryOrderWithMenuOrder(categories: Category[]) {
    categories.sort((c1, c2) => c1.menuOrder - c2.menuOrder)

    for (const c of categories) {
      if (c.children && c.children.length) {
        this.processCategoryOrderWithMenuOrder(c.children)
      }
    }
  }

  private buildMenuOrderData(data: any[], categories: Category[]) {
    for (const c of categories) {
      this.buildMenuOrderDataInternal(data, c)
    }
  }

  private buildMenuOrderDataInternal(data: any[], c: Category) {
    data.push({id: c.id, menuOrder: c.menuOrder})

    if (c.children && c.children.length) {
      for (const child of c.children) {
        this.buildMenuOrderDataInternal(data, child)
      }
    }
  }

  private resetMenuOrdersInternal(c: Category, order: number): number {
    c.menuOrder = order++

    if (c.children && c.children.length) {
      for (let child of c.children) {
        order = this.resetMenuOrdersInternal(child, order)
      }
    }

    return order
  }

}
