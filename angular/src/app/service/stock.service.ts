import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {map} from 'rxjs/operators'
import {BaseHttpService} from './basehttp.service';
import {ProductsWooResponse, ProductWoo, ProductWooResponse} from '../interface/ProductWoo';

@Injectable({providedIn: 'root'})
export class StockService extends BaseHttpService {

  constructor(private http: HttpClient) {
    super()
  }

  getProduct(sku: string): Observable<ProductWoo> {
    return this.http.get<ProductsWooResponse>(`${environment.api}/woo/products/${sku}`).pipe(
      map(res => {
        if (res.success) {
          const pdts = res.data as ProductWoo[]

          if (pdts && pdts.length > 0) {
            const pdtEn = pdts.find(p => p.lang == 'en')
            return pdtEn ? pdtEn : pdts[0]
          } else {
            throw Error(`SKU ${sku} not found`)
          }
        }
        else {
          throw Error(res.data as string)
        }
      })
    )
  }

  setProductStock(idWoo: number, stock: number): Observable<ProductWoo> {
    const data = {
      id: idWoo,
      stock_quantity: stock
    }

    return this.http.post<ProductWooResponse>(`${environment.api}/woo/stock/`, data).pipe(
      map(res => {
        if (res.success) {
          return res.data as ProductWoo
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }
}
