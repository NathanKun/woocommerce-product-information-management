import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {Injectable} from '@angular/core'
import {environment} from '../../environments/environment'
import {map} from 'rxjs/operators'
import {BaseHttpService} from './basehttp.service';
import {MiscItem, MiscItemResponse} from '../interface/MiscItem';

@Injectable({providedIn: 'root'})
export class MiscService extends BaseHttpService {

  constructor(private http: HttpClient) {
    super()
  }

  getMisc(name: string): Observable<MiscItem> {
    return this.http.get<MiscItemResponse>(`${environment.api}/misc/${name}`).pipe(
      map(res => {
        if (res.success) {
          return res.data as MiscItem
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }
}
