import {AttributeValueType} from "../enumeration/AttributeValueType"
import {RestResponse} from "./RestResponse"

export interface CategoryAttribute {
  id: number
  name: string
  description: string
  localizable: boolean
  valueType: AttributeValueType
  order?: number
}

export interface ProductAttribute {
  id: number
  name: string
  description: string
  localizable: boolean
  variation: boolean
  valueType: AttributeValueType
  options: string[]
  order?: number
}

export interface PimLocale {
  id: number
  name: string
  languageCode: string
  countryCode: string
  order?: number
}

export interface Settings {
  categoryAttributes: CategoryAttribute[]
  productAttributes: ProductAttribute[]
  pimLocales: PimLocale[]
}

export interface SettingOrder {
  name: string
  order: number
}

export interface SettingsResponse extends RestResponse<Settings | string>{}
