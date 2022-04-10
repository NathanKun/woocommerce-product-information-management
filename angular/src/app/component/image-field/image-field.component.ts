import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadFileDialogComponent} from '../upload-file/upload-file-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AttributeValuePair} from '../../interface/AttributeValuePair';

@Component({
  selector: 'app-image-field',
  templateUrl: './image-field.component.html',
  styleUrls: ['./image-field.component.scss']
})
export class ImageFieldComponent {

  @Input() attr: AttributeValuePair;
  @Input() imageTitle: string;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  constructor(public dialog: MatDialog) {
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }

  uploadCategoryImage() {
    const dialogRef = this.dialog.open(UploadFileDialogComponent, {
      width: '888px',
      data: {multiFiles: false, imageTitle: this.imageTitle}
    });

    dialogRef.afterClosed().subscribe((url: string[]) => {
      if (url && url.length) {
        this.attr.value = url[0]
      }
    });
  }
}
