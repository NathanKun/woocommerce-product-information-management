import {AttributeValueType} from "../enumeration/AttributeValueType"
import {RestResponse} from "./RestResponse"

export interface CategoryAttribute {
  name: string
  localizable: boolean
  valueType: AttributeValueType
  id: number
}

export interface ProductAttribute {
  name: string
  localizable: boolean
  valueType: AttributeValueType
  id: number
}

export interface PimLocale {
  name: string
  languageCode: string
  countryCode: string
  id: number
}

export interface Settings {
  categoryAttributes: CategoryAttribute[]
  productAttributes: ProductAttribute[]
  pimLocales: PimLocale[]
}

export interface SettingsResponse extends RestResponse<Settings | string>{}

