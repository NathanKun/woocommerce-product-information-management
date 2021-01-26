import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from "../../interface/AttributeValuePair";

@Component({
  selector: 'app-datetime-picker-field',
  templateUrl: './datetime-picker-field.component.html',
  styleUrls: ['./datetime-picker-field.component.scss']
})
export class DatetimePickerFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }
}
