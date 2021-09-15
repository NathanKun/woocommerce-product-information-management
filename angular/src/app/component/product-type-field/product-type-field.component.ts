import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProductType} from '../../enumeration/ProductType';

@Component({
  selector: 'app-product-type-field',
  templateUrl: './product-type-field.component.html',
  styleUrls: ['./product-type-field.component.scss']
})
export class ProductTypeFieldComponent implements OnInit {

  @Input() type: String;
  @Output() typeChange = new EventEmitter<String>();
  @Input() parent: String;
  @Output() parentChange = new EventEmitter<String>();
  @Output() parentBlur = new EventEmitter<String>();

  Simple = ProductType.Simple
  Variable = ProductType.Variable
  Variation = ProductType.Variation
  // Grouped = ProductType.Grouped

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (!this.type || !this.type.length) {
      this.type = this.Simple
    }
  }

  ngModelTypeChange() {
    this.typeChange.emit(this.type)
  }

  ngModelParentChange() {
    this.parentChange.emit(this.parent)
  }

  parentBlurEvent() {
    this.parentBlur.emit(this.parent)
  }

}
