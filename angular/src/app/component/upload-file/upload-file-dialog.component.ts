import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MediaService} from '../../service/media.service';
import {forkJoin, Observable, of} from 'rxjs';
import {AlertService} from '../../service/alert.service';
import {NGXLogger} from 'ngx-logger';
import {catchError, map} from 'rxjs/operators';

interface FileAndResult {
  file: File
  url?: string
  result?: string
}

export interface UploadFileDialogData {
  multiFiles: Boolean;
  imageTitle: string;
}

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss']
})
export class UploadFileDialogComponent {

  multiFiles: Boolean
  imageTitle: string
  files: FileAndResult[] = [];
  uploadResults = []

  START = 'START'
  UPLOADING = 'UPLOADING'
  DONE = 'DONE'
  status = this.START

  constructor(public dialogRef: MatDialogRef<UploadFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UploadFileDialogData,
              private api: MediaService,
              private alertService: AlertService,
              private logger: NGXLogger) {
    this.multiFiles = data.multiFiles
    this.imageTitle = data.imageTitle

    // send upload results when click outside of dialog
    dialogRef.backdropClick().subscribe(() => {
      if (this.status == this.DONE || this.status == this.START)
        dialogRef.close(this.uploadResults);
    });
  }

  onFileSelected(event: Event) {
    this.acceptFiles((event.target as HTMLInputElement).files)
  }

  onFileDropped(event: FileList) {
    this.acceptFiles(event)
  }

  deleteAttachment(index: number) {
    this.files.splice(index, 1)
  }

  async uploadClick(): Promise<void> {
    // disable esc key close dialog
    this.dialogRef.disableClose = true;
    this.status = this.UPLOADING

    const subs: Observable<FileAndResult>[] = []

    for (let file of this.files) {
      const sub = (await this.api.uploadFile(file.file, this.imageTitle)).pipe(
        // OK: set upload result and url
        map(wpMedia => {
          file.result = 'OK'
          file.url = wpMedia.source_url
          return file
        }),
        // KO: catch error, set result failed, and return a FileAndResult obj
        catchError(error => {
          this.alertService.error(`Upload failed: ${file.file.name}`)
          this.logger.error(`Upload failed: ${file.file.name}`, error)
          file.result = 'failed'
          return of(file)
        })
      )

      // add observable in array
      subs.push(sub)
    }

    // wait all observable finish
    forkJoin([...subs]).subscribe((res) => {
      // put image url in dialog result array
      for (let file of res) {
        if (file.url) {
          this.uploadResults.push(file.url)
          file.result = 'OK'
        }
      }

      // disable esc key close dialog
      this.dialogRef.disableClose = false;
      this.status = this.DONE
    })
  }

  private acceptFiles(files: FileList) {
    if (!this.multiFiles) {
      this.files = []
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      if (file.type.split('/')[0] === 'image') {
        this.files.push({file: file})

        if (!this.multiFiles) {
          break;
        }
      }
    }
  }
}
