import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Settings, SettingsResponse} from "../interface/Settings";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {RestResponse} from "../interface/RestResponse";

@Injectable({providedIn: 'root'})
export class SettingsService {
  private cache: Settings;

  constructor(private http: HttpClient) {
  }

  getSettings(): Observable<Settings> {
    if (this.cache) {
      return of(this.cache);
    }

    return this.http.get<SettingsResponse>(`${environment.api}/settings/`).pipe(
      map(res => {
        if (res.success) {
          this.cache = res.data as Settings;
          return this.cache;
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }

  reloadSettings() {
    this.cache = null;
    return this.getSettings();
  }

  addPimLocale(name: string, countryCode: string, languageCode: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/pimLocale`, {
      name: name,
      countryCode: countryCode,
      languageCode: languageCode
    }).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  addCategoryAttribute(name: string, localizable: boolean, valueType: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/categoryAttribute`, {
      name: name,
      localizable: localizable,
      valueType: valueType
    }).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  addProductAttribute(name: string, localizable: boolean, valueType: String): Observable<string> {
    return this.http.post<RestResponse<string>>(`${environment.api}/settings/productAttribute`, {
      name: name,
      localizable: localizable,
      valueType: valueType
    }).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deletePimLocale(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/pimLocale`, SettingsService.buildDeleteRequestOption(id)).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deleteCategoryAttribute(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/categoryAttribute`, SettingsService.buildDeleteRequestOption(id)).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  deleteProductAttribute(id: number): Observable<string> {
    return this.http.request<RestResponse<string>>(
      'delete', `${environment.api}/settings/productAttribute`, SettingsService.buildDeleteRequestOption(id)).pipe(
      map(res => {
        if (res.success) {
          return res.data
        } else {
          throw Error(res.data)
        }
      })
    )
  }

  private static buildDeleteRequestOption(id: number) {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body: {id: id}
    }
  }
}
