import {Component, Input, OnInit} from '@angular/core';
import {SettingsService} from "../../service/settings.service";

@Component({
  selector: 'app-flagged-attribute-name',
  templateUrl: './flagged-attribute-name.component.html',
  styleUrls: ['./flagged-attribute-name.component.scss']
})
export class FlaggedAttributeNameComponent implements OnInit {

  @Input() name: string
  @Input() hideIfNotLocalizable?: boolean = false
  @Input() flagOnly?: boolean = false

  hasLocale = false
  countryCode: string
  shouldHide: boolean

  constructor(private settingsService: SettingsService) {
  }

  async ngOnInit() {
    const settings = await this.settingsService.getSettings()
    settings.pimLocales

    if (this.name && this.name.indexOf("#") != -1) {
      const languageCode = this.name.split("#").pop()
      this.countryCode = settings.pimLocales.find(l => l.languageCode === languageCode).countryCode
      this.hasLocale = true
      this.shouldHide = false
    } else {
      this.shouldHide = this.hideIfNotLocalizable
    }
  }

}
