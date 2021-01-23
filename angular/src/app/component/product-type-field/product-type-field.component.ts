import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ProductType} from "../../enumeration/ProductType";

@Component({
  selector: 'app-product-type-field',
  templateUrl: './product-type-field.component.html',
  styleUrls: ['./product-type-field.component.scss']
})
export class ProductTypeFieldComponent implements OnInit {

  @Input() attr: String;
  @Output() attrChange = new EventEmitter<String>();

  Simple = ProductType.Simple
  Variable = ProductType.Variable
  // Variation = ProductType.Variation
  // Grouped = ProductType.Grouped

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (!this.attr || !this.attr.length) {
      this.attr = this.Simple
    }
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }

}
