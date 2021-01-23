import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-category-select-field',
  templateUrl: './category-select-field.component.html',
  styleUrls: ['./category-select-field.component.scss']
})
export class CategorySelectFieldComponent implements OnInit {

  @Input() attr: number[];
  @Input() label: String;
  @Input() categorySelectTree: Map<string, number>;
  @Input() multiple: boolean;
  @Output() attrChange = new EventEmitter<number[]>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngModelChange(event: MatSelectChange) {
    this.attrChange.emit(this.attr)
  }

  keepOrderSort = (a, b) => a
}
