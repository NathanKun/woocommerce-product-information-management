import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UploadFileDialog} from "../upload-file/upload-file-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AttributeValuePair} from "../../interface/AttributeValuePair";

@Component({
  selector: 'app-image-field',
  templateUrl: './image-field.component.html',
  styleUrls: ['./image-field.component.scss']
})
export class ImageFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }

  uploadCategoryImage() {
    const dialogRef = this.dialog.open(UploadFileDialog, {
      width: '512px',
      data: {multiFiles: false}
    });

    dialogRef.afterClosed().subscribe((url: string[]) => {
      if (url && url.length) {
        this.attr.value = url[0]
      }
    });
  }
}
