import {HttpClient} from '@angular/common/http';
import {Observable, Observer, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Settings, SettingsResponse} from "../interface/Settings";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {RestResponse} from "../interface/RestResponse";
import {BaseHttpService} from "./basehttp.service";

@Injectable({providedIn: 'root'})
export class SettingsService extends BaseHttpService {
  private cache: Settings;

  private observers: Observer<Settings>[];
  $settings: Observable<Settings>

  constructor(private http: HttpClient) {
    super();
    this.observers = [];
    this.$settings = new Observable((observer: Observer<Settings>) => {
      this.observers.push(observer);
    });
  }

  async getSettings(): Promise<Settings> {
    if (this.cache) {
      this.observers.forEach((observer) => observer.next(this.cache));
      return this.cache;
    }

    const settings = await this.http.get<SettingsResponse>(`${environment.api}/settings/`).pipe(
      map(res => {
        if (res.success) {
          this.cache = res.data as Settings;
          return this.cache;
        } else {
          throw Error(res.data as string)
        }
      })
    ).toPromise()

    this.observers.forEach((observer) => observer.next(settings));

    return settings
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
      variation: false,
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
