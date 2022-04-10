import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from '../../interface/AttributeValuePair';
import {MatDialog} from '@angular/material/dialog';
import {RichTextFieldDialog} from '../rich-text-field-dialog/rich-text-field-dialog.component';

@Component({
  selector: 'app-rich-text-field',
  templateUrl: './rich-text-field.component.html',
  styleUrls: ['./rich-text-field.component.scss']
})
export class RichTextFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Input() imageTitle: string;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    if (!this.attr.value) {
      this.attr.value = ''
    }
  }

  editOnClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(RichTextFieldDialog, {
      width: '80%',
      height: '80%',
      data: {html: this.attr.value, imageTitle: this.imageTitle}
    });

    dialogRef.afterClosed().subscribe((html: string) => {
      if (html) {
        this.attr.value = html
      }
    });
  }
}
