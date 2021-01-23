import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {ProductAttribute, Settings} from "../interface/Settings"
import {environment} from "../../environments/environment"
import {map} from "rxjs/operators"
import {Product, ProductResponse} from "../interface/Product"
import {SettingsService} from "./settings.service";
import {RestResponse} from "../interface/RestResponse";
import {BaseHttpService} from "./basehttp.service";
import {Tool} from "../util/Tool";

@Injectable({providedIn: 'root'})
export class ProductService extends BaseHttpService {
  private settings: Settings
  private allLocalizedProductAttr: ProductAttribute[] = []

  constructor(private http: HttpClient,
              settingsService: SettingsService) {
    super()
    settingsService.$settings.subscribe(
      res => {
        this.settings = res
        Tool.prepareAttrArrays(this.settings.productAttributes, this.settings.pimLocales)
      }
    )
    settingsService.getSettings().then()
  }

  getProducts(): Promise<Product[]> {
    return this.http.get<ProductResponse>(`${environment.api}/products/`).pipe(
      map(res => {
        if (res.success) {
          const products = res.data as Product[]
          this.processProducts(products)
          return products
        } else {
          throw Error(res.data as string)
        }
      })
    ).toPromise()
  }

  saveNewProduct(pdt: Product): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/products/`, pdt).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  updateProduct(pdt: Product): Observable<string> {
    return this.http.put<RestResponse<string>>(`${environment.api}/products/`, pdt).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deleteProduct(pdt: Product): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete',
      `${environment.api}/products/`,
      this.buildDeleteRequestOption(pdt.id)
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

  createNewProduct(): Product {
    const pdt = {
      sku: "",
      name: "",
      attributes: [],
      categoryIds: [],
      menuOrder: -1,
      id: -1
    }
    Tool.processItemFillAttributes(pdt, this.allLocalizedProductAttr)
    return pdt
  }

  processProducts(products: Product[]) {
    for (let pdt of products) {
      Tool.processItemFillAttributes(pdt, this.allLocalizedProductAttr)
    }

    products.sort((c1, c2) => c1.menuOrder - c2.menuOrder)
  }

  resetMenuOrders(products: Product[]) {
    let order = 0
    // TODO: not implemented
  }

  saveMenuOrders(products: Product[]): Observable<string> {
    const data = []
    this.buildMenuOrderData(data, products)

    return this.http.put<RestResponse<string>>(`${environment.api}/products/order`, {data: data}).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  private buildMenuOrderData(data: any[], products: Product[]) {
    // TODO: not implemented
  }
}
