import {RestResponse} from './RestResponse';

export interface VariationAttribute {
  id: number
  name: string
  terms: VariationAttributeTerm[]
}

export interface VariationAttributeTerm {
  id: number
  name: string
  lang: string
}

export interface VariationAttributeResponse extends RestResponse<VariationAttribute[] | string> {
}
