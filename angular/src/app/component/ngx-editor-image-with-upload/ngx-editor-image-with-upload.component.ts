import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {EditorState, Plugin, PluginKey, Transaction, NodeSelection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Editor} from "ngx-editor";
import {setBlockType} from 'prosemirror-commands';
import {isNodeActive} from 'ngx-editor/helpers';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import ImageCommand from "./ImageCommand";
import {MatDialog} from "@angular/material/dialog";
import {UploadFileDialog} from "../upload-file/upload-file-dialog.component";

@Component({
  selector: 'app-ngx-editor-image-with-upload',
  templateUrl: './ngx-editor-image-with-upload.component.html',
  styleUrls: ['./ngx-editor-image-with-upload.component.scss']
})
export class NgxEditorImageWithUploadComponent implements OnInit {
  constructor(private el: ElementRef,
              public dialog: MatDialog) {
  }

  @Input() editor: Editor;

  isActive = false;
  isDisabled = false;
  showPopup = false;
  uploadDialogDisplaying = false

  form = new FormGroup({
    src: new FormControl('', [
      Validators.required,
      Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
    ]),
    alt: new FormControl(''),
    title: new FormControl('')
  });

  get src(): AbstractControl {
    return this.form.get('src');
  }

  toolbarIconOnClick(e: MouseEvent): void {
    e.preventDefault();

    if (e.button !== 0) {
      return;
    }

    this.showPopup = !this.showPopup;

    if (this.showPopup) {
      this.fillForm();
    }
  }

  insertButtonOnClick(e: MouseEvent): void {
    e.preventDefault();
    const { src, alt, title } = this.form.getRawValue();
    const { dispatch, state } = this.editor.view;

    const attrs = {
      alt,
      title
    };

    ImageCommand.insert(src, attrs)(state, dispatch);
    this.editor.view.focus();
    this.hideForm();
  }

  uploadOnClick(event: Event) {
    event.preventDefault()

    const dialogRef = this.dialog.open(UploadFileDialog, {
      width: '512px',
      data: {multiFiles: false}
    });

    this.uploadDialogDisplaying = true

    dialogRef.afterClosed().subscribe((url: string[]) => {
      if (url && url.length) {
        this.form.setValue({
          src: url[0], alt: "", title: ""
        })
      }

      this.uploadDialogDisplaying = false
    });
  }

  updateToolState = (view: EditorView) => {
    const {state} = view;
    this.isActive = ImageCommand.isActive(state)
    // this.isDisabled = !this.execute(state, null); // returns true if executable
  };

  ngOnInit(): void {
    const plugin = new Plugin({
      key: new PluginKey(`custom-menu-image-with-upload`),
      view: () => {
        return {
          update: this.updateToolState,
        };
      },
    });

    this.editor.registerPlugin(plugin);
  }

  @HostListener('document:mousedown', ['$event']) onDocumentClick(e: MouseEvent): void {
    if ((!this.el.nativeElement.contains(e.target) && !this.uploadDialogDisplaying) && this.showPopup) {
      this.hideForm();
    }
  }

  private fillForm(): void {
    const { state } = this.editor.view;
    const { selection } = state;
    if (selection instanceof NodeSelection && this.isActive) {
      const { src, alt = '', title = '' } = selection.node.attrs;

      this.form.setValue({
        src,
        alt,
        title
      });
    }
  }

  private hideForm(): void {
    this.showPopup = false;
    this.form.reset({
      src: '',
      alt: '',
      title: ''
    });
  }
}
