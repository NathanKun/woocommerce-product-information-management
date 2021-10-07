import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Category} from '../../interface/Category';
import {MatSelectionList} from '@angular/material/list';

@Component({
  selector: 'app-export-csv-chose-categories-dialog',
  templateUrl: './export-csv-chose-categories-dialog.component.html',
  styleUrls: ['./export-csv-chose-categories-dialog.component.scss']
})
export class ExportCsvChoseCategoriesDialog {
  @ViewChild('select')
  private select: MatSelectionList

  categories: Category[]

  constructor(
    public dialogRef: MatDialogRef<ExportCsvChoseCategoriesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ExportCsvChoseCategoriesDialogData) {
    this.categories = data.categories
  }

  exportOnClick() {
    this.dialogRef.close(this.select.selectedOptions.selected.map(it => it.value))
  }
}

export class ExportCsvChoseCategoriesDialogData {
  categories: Category[]
}
