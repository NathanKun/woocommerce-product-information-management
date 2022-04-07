import {RestResponse} from './RestResponse';

export interface VariationAttribute {
  id?: number
  name: string
  terms: VariationAttributeTerm[]
}

export interface VariationAttributeTerm {
  id?: number
  name: string
  translations: VariationAttributeTermTranslation[]
  disableNameInput?: boolean
}

export interface VariationAttributeTermTranslation {
  id?: number
  lang: string
  translation: string
}

export interface VariationAttributeResponse extends RestResponse<VariationAttribute[] | string> {
}
