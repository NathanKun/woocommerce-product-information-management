import {HttpClient, HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {BaseHttpService} from './basehttp.service';

@Injectable({providedIn: 'root'})
export class ExportService extends BaseHttpService {

  constructor(private http: HttpClient) {
    super()
  }

  exportCategories(): Observable<any> {
    return this.http.post<any>(`${environment.api}/woo/export-categories`, null, {
      responseType: 'text' as const,
    } as any);
  }
}
