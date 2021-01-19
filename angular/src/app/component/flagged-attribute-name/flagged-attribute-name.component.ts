import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-flagged-attribute-name',
  templateUrl: './flagged-attribute-name.component.html',
  styleUrls: ['./flagged-attribute-name.component.scss']
})
export class FlaggedAttributeNameComponent implements OnInit {

  @Input() name: string
  @Input() hideIfNotLocalizable?: boolean = false
  hasLocale = false
  locale: string
  shouldHide: boolean

  constructor() { }

  ngOnInit(): void {
    if (this.name && this.name.indexOf("#") != -1) {
      this.locale = this.name.split("#").pop()
      this.hasLocale = true
      this.shouldHide = false
    } else {
      this.shouldHide = this.hideIfNotLocalizable
    }
  }

}
