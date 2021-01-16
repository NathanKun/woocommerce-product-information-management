import {RestResponse} from "./RestResponse"

export interface AttributeValuePair {
  name: string
  value?: string
  id?: number
}

export interface Category {
  code: string
  name: string
  parentId?: number
  attributes: AttributeValuePair[]
  id: number
  createdAt?: Date
  updatedAt?: Date
  attributeMap?: Map<string, AttributeValuePair>
  children?: Category[]
}

export interface CategoryResponse extends RestResponse<Category[] | string> {
}
