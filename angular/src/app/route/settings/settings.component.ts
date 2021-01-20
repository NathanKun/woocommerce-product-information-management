import {AfterViewInit, Component} from '@angular/core'
import {SettingsService} from "../../service/settings.service"
import {Settings} from "../../interface/Settings"
import {FormControl, Validators} from "@angular/forms"
import {NGXLogger} from "ngx-logger"
import {AlertService} from "../../service/alert.service"
import {AttributeValueType, AttributeValueTypeTool} from "../../enumeration/AttributeValueType"
import {RouteReuseStrategy} from "@angular/router";
import {CustomRouteReuseStrategy} from "../../route-reuse-strategy";

@Component({
  selector: 'app-pim-locale-setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewInit {
  // local form
  localeNameFormControl = new FormControl('', [
    Validators.required
  ])
  localeCountryCodeFormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[a-z]{2,3}$/)
  ])
  localeLanguageCodeFormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[a-z]{2,3}$/)
  ])
  deleteLocaleLock = true

  // category attr form
  categoryAttributeNameFormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[a-z0-9_]+$/)
  ])
  categoryAttributeDescriptionFormControl = new FormControl('')
  categoryAttributeLocalizable = false
  categoryAttributeValueType = AttributeValueType.TEXT
  deleteCategoryAttributeLock = true

  // product attr form
  productAttributeNameFormControl = new FormControl('', [
    Validators.required, Validators.pattern(/^[a-z0-9_]+$/)
  ])
  productAttributeDescriptionFormControl = new FormControl('')
  productAttributeLocalizable = false
  productAttributeValueType = AttributeValueType.TEXT
  deleteProductAttributeLock = true

  readonly attributeValueTypes = AttributeValueTypeTool.translatedValues
  readonly localeColumns: string[] = ['flag', 'name', 'countryCode', 'languageCode', 'id']
  readonly categoryAttributesColumns: string[] = ['name', 'localizable', 'valueType', 'id']
  readonly productAttributesColumns: string[] = ['name', 'localizable', 'valueType', 'id']

  settingsLoading = true
  settings: Settings
  addingNewLocale = false
  addingNewCategoryAttribute = false
  addingNewProductAttribute = false

  constructor(private api: SettingsService,
              private logger: NGXLogger,
              private alertService: AlertService,
              private routeReuseStrategy: RouteReuseStrategy) {
  }

  async ngAfterViewInit() {
    await this.loadData()
  }

  async loadData() {
    try {
      this.settings = await this.api.getSettings()
    } catch (error) {
      this.logger.error(error)
      this.alertService.error(error)
    }

    this.settingsLoading = false
  }

  async reloadData() {
    // settings changed, clear stored routes
    (this.routeReuseStrategy as CustomRouteReuseStrategy).storedRoutes = {}

    try {
      this.settings = await this.api.reloadSettings()
    } catch (error) {
      this.logger.error(error)
      this.alertService.error(error)
    }

  }

  addLocale() {
    this.api.addPimLocale(this.localeNameFormControl.value, this.localeCountryCodeFormControl.value, this.localeLanguageCodeFormControl.value).subscribe(
      () => {
        this.localeNameFormControl.reset()
        this.localeCountryCodeFormControl.reset()
        this.localeLanguageCodeFormControl.reset()
        this.reloadData().then()
      }, this.handleError1
    )
  }

  addCategoryAttribute() {
    this.api.addCategoryAttribute(
      this.categoryAttributeNameFormControl.value,
      this.categoryAttributeDescriptionFormControl.value,
      this.categoryAttributeLocalizable,
      this.categoryAttributeValueType
    ).subscribe(
      () => {
        this.categoryAttributeNameFormControl.reset()
        // this.categoryAttributeLocalizable = false
        // this.categoryAttributeValueType = AttributeValueType.TEXT
        this.reloadData().then()
      }, this.handleError2
    )
  }

  addProductAttribute() {
    this.api.addProductAttribute(
      this.productAttributeNameFormControl.value,
      this.productAttributeDescriptionFormControl.value,
      this.productAttributeLocalizable,
      this.productAttributeValueType
    ).subscribe(
      () => {
        this.productAttributeNameFormControl.reset()
        // this.productAttributeLocalizable = false
        // this.productAttributeValueType = AttributeValueType.TEXT
        this.reloadData().then()
      }, this.handleError2
    )
  }

  deleteLocale(id: number) {
    this.api.deletePimLocale(id).subscribe(
      () => {
        this.reloadData().then()
      }, this.handleError3
    )
  }

  deleteCategoryAttribute(id: number) {
    this.api.deleteCategoryAttribute(id).subscribe(
      () => {
        this.reloadData().then()
      }, this.handleError3
    )
  }

  deleteProductAttribute(id: number) {
    this.api.deleteProductAttribute(id).subscribe(
      () => {
        this.reloadData().then()
      }, this.handleError3
    )
  }

  getAttributeValueTypeTranslation(type: AttributeValueType): string {
    const filter = AttributeValueTypeTool.translatedValues.find(v => v.value === type)
    if (filter) {
      return filter.name
    } else {
      return ''
    }
  }

  private handleError1 = error => {
    this.logger.error(error)
    this.alertService.error("添加失败，该地区可能已存在。")
  }

  private handleError2 = error => {
    this.logger.error(error)
    this.alertService.error("添加失败，该参数名可能已存在。")
  }

  private handleError3 = error => {
    this.logger.error(error)
    this.alertService.error("出现错误。")
  }
}
