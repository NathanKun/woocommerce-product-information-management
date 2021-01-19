import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from "../../interface/Category";

@Component({
  selector: 'app-boolean-field',
  templateUrl: './boolean-field.component.html',
  styleUrls: ['./boolean-field.component.scss']
})
export class BooleanFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  checked: boolean

  constructor() {
  }

  ngOnInit(): void {
    if (this.attr.value === '1') {
      this.checked = true
    } else if (this.attr.value === '0') {
      this.checked = false
    } else {
      this.attr.value = '0'
      this.checked = false
    }
  }

  ngModelChange() {
    console.log(this.checked)
    this.attr.value = this.checked ? '1' : '0'
    this.attrChange.emit(this.attr)
  }

}
