import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Editor, toDoc, toHTML, Toolbar} from 'ngx-editor';
import {FormControl, FormGroup} from '@angular/forms';
import plugins from '../../util/ngx-editor-plugin';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface RichTextFieldDialogData {
  html: string;
  imageTitle: string;
}

@Component({
  selector: 'app-rich-text-field-dialog',
  templateUrl: './rich-text-field-dialog.component.html',
  styleUrls: ['./rich-text-field-dialog.component.scss']
})
export class RichTextFieldDialog implements OnInit, OnDestroy {

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['link'],
  ];

  form = new FormGroup({
    editorContent: new FormControl(''),
  });

  dataHtml?: string
  imageTitle: string

  constructor(public dialogRef: MatDialogRef<RichTextFieldDialog>,
              @Inject(MAT_DIALOG_DATA) public data: RichTextFieldDialogData) {
    this.dataHtml = data.html
    this.imageTitle = data.imageTitle
  }

  ngOnInit(): void {
    this.editor = new Editor({
      plugins,
    });

    if (this.dataHtml) {
      this.form.get('editorContent').setValue(toDoc(this.dataHtml))
    }

    this.dialogRef.backdropClick().subscribe(
      () => {
        const val = this.form.get('editorContent').value
        let rtVal: string
        if (typeof val === 'string') {
          rtVal = val
        } else {
          rtVal = toHTML(this.form.get('editorContent').value)
        }
        this.dialogRef.close(rtVal)
      }
    )
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
