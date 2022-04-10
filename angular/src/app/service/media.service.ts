import {Injectable} from '@angular/core';
import {BaseHttpService} from './basehttp.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {WpMedia, WpMediaResponse} from '../interface/WpMedia';


@Injectable({providedIn: 'root'})
export class MediaService extends BaseHttpService {

  constructor(private http: HttpClient) {
    super();
  }

  uploadFile(file: File, title: string): Observable<WpMedia> {
    const formData = new FormData();
    const uuid = uuidv4()
    const ext = file.name.split('.').pop()
    const filename = uuid + '.' + ext

    formData.append('file', file);
    formData.append('filename', filename);
    formData.append('title', title);

    return this.http.post<WpMediaResponse>(`${environment.api}/wp/media`, formData).pipe(
      map(res => {
        if (res.success) {
          return res.data as WpMedia
        } else {
          throw Error(res.data as string)
        }
      })
    )
  }
}
