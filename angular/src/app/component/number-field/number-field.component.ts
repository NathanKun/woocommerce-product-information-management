import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from "../../interface/AttributeValuePair";

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss']
})
export class NumberFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Input() options: string[];
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  min = null
  max = null
  required = false

  constructor() {
  }

  ngOnInit(): void {
    if (this.options) {
      if (this.options.length > 0) {
        this.required = this.options[0] == "true"
      }
      if (this.options.length > 1) {
        this.min = Number(this.options[1])
      }
      if (this.options.length > 2) {
        this.max = Number(this.options[2])
      }
    }
  }

  ngModelChange() {
    if (this.min != null && this.attr.value < this.min) {
      this.attr.value = this.min
    }
    if (this.max != null && this.attr.value > this.max) {
      this.attr.value = this.max
    }
    this.attrChange.emit(this.attr)
  }

}
