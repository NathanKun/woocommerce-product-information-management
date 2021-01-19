import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from "../../interface/Category";
import {MatDialog} from "@angular/material/dialog";
import {RichTextFieldDialog} from "../rich-text-field-dialog/rich-text-field-dialog.component";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-rich-text-field',
  templateUrl: './rich-text-field.component.html',
  styleUrls: ['./rich-text-field.component.scss']
})
export class RichTextFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  html: SafeHtml

  constructor(public dialog: MatDialog,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (!this.attr.value) {
      this.attr.value = ""
    }

    this.html = this.sanitizer.bypassSecurityTrustHtml(this.attr.value)
  }

  editOnClick() {
    const dialogRef = this.dialog.open(RichTextFieldDialog, {
      width: '80%',
      height: '80%',
      data: {html: this.attr.value}
    });

    dialogRef.afterClosed().subscribe((html: string) => {
      if (html) {
        this.attr.value = html
        this.html = this.sanitizer.bypassSecurityTrustHtml(this.attr.value)
      }
    });
  }
}
