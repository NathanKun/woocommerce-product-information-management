import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadFileDialogComponent} from '../upload-file/upload-file-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AttributeValuePair} from '../../interface/AttributeValuePair';

@Component({
  selector: 'app-image-set-field',
  templateUrl: './image-set-field.component.html',
  styleUrls: ['./image-set-field.component.scss']
})
export class ImageSetFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Input() imageTitle: string;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  urls: string[] = []

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.showUrls()
  }

  ngModelChange() {
    this.attr.value = JSON.stringify(this.urls.filter(url => url && url.length))
    this.attrChange.emit(this.attr)
  }

  // add new field automatically
  addNewFieldIfNeeded() {
    if (this.urls.length) {
      const lastValue = this.urls[this.urls.length - 1];
      if (lastValue && lastValue.length) {
        this.urls.push('')
      }
    }
  }

  deleteImage(i: number) {
    this.urls.splice(i, 1)
    this.ngModelChange() // reflect this.urls changes to model
    this.showUrls()
  }

  uploadImage() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '888px',
      data: {multiFiles: true, imageTitle: this.imageTitle}
    });

    // when upload dialog closed
    dialogRef.afterClosed().subscribe((urls: string[]) => {
      if (urls && urls.length) {
        // add new urls to this.urls
        this.urls.push(...urls)
        // save this.urls to attr.value
        this.attr.value = JSON.stringify(this.urls.filter(url => url && url.length))
        this.showUrls()
      }
    });
  }

  showUrls() {
    if (this.attr.value && this.attr.value.length) {
      // parse attr.value and store in this.urls
      this.urls = JSON.parse(this.attr.value)

      // if parsed value is no correct, set this.urls as [""] to display a empty input
      if (!this.urls || !this.urls.length) {
        this.urls = ['']
      }
    } else {
      // attr.value is empty, set this.urls as [""] to display a empty input
      this.urls = ['']
    }
  }
}
