import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {BaseHttpService} from './basehttp.service';
import {VariationAttribute, VariationAttributeResponse} from '../interface/VariationAttribute';
import {map} from 'rxjs/operators';
import {RestResponse} from '../interface/RestResponse';

@Injectable({providedIn: 'root'})
export class VariationAttributeService extends BaseHttpService {

  private baseUrl = `${environment.api}/variation-attributes/`

  constructor(private http: HttpClient) {
    super()
  }

  getVariationAttributes(): Observable<VariationAttribute[]> {
    return this.http.get<VariationAttributeResponse>(this.baseUrl).pipe(
      map(res => {
        if (res.success) {
          return res.data as VariationAttribute[]
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }

  saveNewVariationAttribute(attr: VariationAttribute): Observable<string> {
    return this.http.post<RestResponse<string>>(this.baseUrl, attr).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  updateVariationAttribute(attr: VariationAttribute): Observable<string> {
    return this.http.put<RestResponse<string>>(this.baseUrl, attr).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deleteVariationAttribute(attr: VariationAttribute): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete',
      `${environment.api}/variation-attributes/`,
      this.buildDeleteRequestOption(attr.id)
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
}
