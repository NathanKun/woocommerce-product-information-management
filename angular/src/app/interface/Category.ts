import {RestResponse} from "./RestResponse"
import {AttributeValueType} from "../enumeration/AttributeValueType";

export interface AttributeValuePair {
  id?: number
  name: string
  value?: string
  type: AttributeValueType
}

export interface Category {
  id: number
  code: string
  name: string
  menuOrder: number
  parentId?: number
  image?: string
  attributes: AttributeValuePair[]
  createdAt?: Date
  updatedAt?: Date
  children?: Category[]
}

export interface CategoryResponse extends RestResponse<Category[] | string> {
}
