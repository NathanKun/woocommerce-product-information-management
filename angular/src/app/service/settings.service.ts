import {HttpClient} from '@angular/common/http';
import {lastValueFrom, Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Settings, SettingsResponse} from '../interface/Settings';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {RestResponse} from '../interface/RestResponse';
import {BaseHttpService} from './basehttp.service';

@Injectable({providedIn: 'root'})
export class SettingsService extends BaseHttpService {
  private cache: Settings;
  private getSettingsPromise: Promise<Settings> = null
  $settings: Subject<Settings>

  constructor(private http: HttpClient) {
    super();
    this.$settings = new Subject<Settings>();
  }

  getSettings(): Promise<Settings> {
    if (this.cache) {
      return Promise.resolve(this.cache);
    }

    if (this.getSettingsPromise == null) {
      this.getSettingsInternal()
    }

    return this.getSettingsPromise
  }

  private getSettingsInternal() {
    this.getSettingsPromise = lastValueFrom(this.http.get<SettingsResponse>(`${environment.api}/settings/`).pipe(
      map(res => {
        if (res.success) {
          const settings = res.data as Settings;

          // order
          settings.productAttributeOrderMap = new Map<string, number>()
          settings.categoryAttributeOrderMap = new Map<string, number>()
          settings.pimLocaleOrderMap = new Map<string, number>()
          for (const [i, attr] of settings.productAttributes.entries()) {
            attr.order = i
            settings.productAttributeOrderMap.set(attr.name, attr.order)
          }
          for (const [i, attr] of settings.categoryAttributes.entries()) {
            attr.order = i
            settings.categoryAttributeOrderMap.set(attr.name, attr.order)
          }
          for (const [i, loc] of settings.pimLocales.entries()) {
            loc.order = i
            settings.pimLocaleOrderMap.set(loc.languageCode, loc.order)
          }

          this.cache = settings
          this.$settings.next(settings)
          return settings;
        } else {
          throw Error(res.data as string)
        }
      })
    ))
  }

  async reloadSettings(): Promise<Settings> {
    this.cache = null;
    return await this.getSettings();
  }

  addPimLocale(name: string, countryCode: string, languageCode: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/pimLocale`, {
      name: name,
      countryCode: countryCode,
      languageCode: languageCode
    }).pipe(
      map(this.handleResponse)
    )
  }

  addCategoryAttribute(name: string, description: string, localizable: boolean, valueType: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/categoryAttribute`, {
      name: name,
      description: description,
      localizable: localizable,
      valueType: valueType
    }).pipe(
      map(this.handleResponse)
    )
  }

  addProductAttribute(name: string, description: string, localizable: boolean, valueType: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/productAttribute`, {
      name: name,
      description: description,
      localizable: localizable,
      valueType: valueType,
      variation: true,
      options: [] // TODO
    }).pipe(
      map(this.handleResponse)
    )
  }

  deletePimLocale(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/pimLocale`, this.buildDeleteRequestOption(id)).pipe(
      map(this.handleResponse)
    )
  }

  deleteCategoryAttribute(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/categoryAttribute`, this.buildDeleteRequestOption(id)).pipe(
      map(this.handleResponse)
    )
  }

  deleteProductAttribute(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/productAttribute`, this.buildDeleteRequestOption(id)).pipe(
      map(this.handleResponse)
    )
  }

  private handleResponse = res => {
    if (res.success) {
      return res.data
    } else {
      throw Error(res.data)
    }
  }
}
