import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flaged-attribute-name',
  templateUrl: './flaged-attribute-name.component.html',
  styleUrls: ['./flaged-attribute-name.component.scss']
})
export class FlagedAttributeNameComponent implements OnInit {

  @Input() name: string
  hasLocale = false
  locale: string

  constructor() { }

  ngOnInit(): void {
    if (this.name && this.name.indexOf("#") != -1) {
      this.locale = this.name.split("#").pop()
      this.hasLocale = true
    }
  }

}
