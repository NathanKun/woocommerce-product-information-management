import {Injectable} from '@angular/core';
import {BaseHttpService} from './basehttp.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgxImageCompressService} from 'ngx-image-compress';
import {v4 as uuidv4} from 'uuid';
import {environment} from '../../environments/environment';
import {WpMedia, WpMediaResponse} from '../interface/WpMedia';


@Injectable({providedIn: 'root'})
export class MediaService extends BaseHttpService {

  private readonly MAX_FILE_SIZE = 1024 * 1024 * 2;
  private readonly MIN_QUALITY = 50;

  constructor(private http: HttpClient, private imageCompress: NgxImageCompressService) {
    super();
  }

  async uploadFile(file: File, title: string): Promise<Observable<WpMedia>> {
    const formData = new FormData();
    const uuid = uuidv4()
    const ext = file.name.split('.').pop()
    const filename = uuid + '.' + ext

    formData.append('file', await this.compressFile(file));
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

  async compressFile(file: File): Promise<Blob> {
    const dataUrl = await this.readFile(file)
    const fileSize = this.imageCompress.byteCount(dataUrl)
    console.log('Before compress file size = ' + fileSize)

    let dataUrlResult: string
    let fileSizeCompressed: number
    let quality = 100;
    do {
      const orientation = await this.imageCompress.getOrientation(file)
      dataUrlResult = await this.imageCompress.compressFile(dataUrl, orientation, 100, quality, 3840, 2160)

      fileSizeCompressed = this.imageCompress.byteCount(dataUrlResult)
      console.log('After compress file size = ' + fileSizeCompressed + ' quality = ' + quality)

      quality -= 10
    } while (quality >= this.MIN_QUALITY && fileSizeCompressed > this.MAX_FILE_SIZE)


    return this.dataURItoBlob(dataUrlResult, file.type)
  }

  readFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result as string)
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  dataURItoBlob(dataURI, type) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type});
  }
}
