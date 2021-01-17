import {Injectable} from "@angular/core";
import {BaseHttpService} from "./basehttp.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RestResponse} from "../interface/RestResponse";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class S3Service extends BaseHttpService {

  constructor(private http: HttpClient) {
    super();
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    const date = new Date()
    const path = `images/upload/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('path', path);

    return this.http.post<RestResponse<string>>(`${environment.api}/s3/`, formData).pipe(
      map(res => {
        if (res.success) {
          return `https://woo-imgs.apeprogrammer.com/${path}/${file.name}`
        } else {
          throw Error(res.data)
        }
      })
    )
  }
}
