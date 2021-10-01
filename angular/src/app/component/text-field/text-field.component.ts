import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeValuePair} from '../../interface/AttributeValuePair';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnInit {

  @Input() attr: AttributeValuePair;
  @Input() options: string[];
  @Output() attrChange = new EventEmitter<AttributeValuePair>();

  required = false
  pattern = ''

  constructor() {
  }

  ngOnInit(): void {
    if (this.options != null) {
      if (this.options.length > 0) {
        this.required = this.options[0] == 'true'
      }

      if (this.options.length > 1) {
        this.pattern = this.options[1]
      }
    }
  }

  ngModelChange() {
    this.attrChange.emit(this.attr)
  }

}
