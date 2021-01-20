import {AttributeValueType} from "../enumeration/AttributeValueType"
import {RestResponse} from "./RestResponse"

export interface CategoryAttribute {
  id: number
  name: string
  description: string
  localizable: boolean
  valueType: AttributeValueType
}

export interface ProductAttribute {
  id: number
  name: string
  description: string
  localizable: boolean
  valueType: AttributeValueType
}

export interface PimLocale {
  id: number
  name: string
  languageCode: string
  countryCode: string
}

export interface Settings {
  categoryAttributes: CategoryAttribute[]
  productAttributes: ProductAttribute[]
  pimLocales: PimLocale[]
}

export interface SettingsResponse extends RestResponse<Settings | string>{}
