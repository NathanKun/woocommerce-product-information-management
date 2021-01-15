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
  attributeMap?: Map<string, AttributeValuePair>
  id: number
  createdAt?: Date
  updatedAt?: Date
  children?: Category[]
}

export interface CategoryResponse extends RestResponse<Category[] | string> {
}
