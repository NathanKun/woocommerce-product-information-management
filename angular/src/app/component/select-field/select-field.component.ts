import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from "../../interface/AttributeValuePair";

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Input() options: string[];
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  constructor() {
  }

  ngOnInit(): void {
    if ((this.attr.value == null || this.attr.value.length === 0) && this.options && this.options.length) {
      this.attr.value = this.options[0]
    }
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }

}
