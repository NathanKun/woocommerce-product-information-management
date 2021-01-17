import {RestResponse} from "./RestResponse"
import {AttributeValueType} from "../enumeration/AttributeValueType";

export interface AttributeValuePair {
  name: string
  value?: string
  id?: number
  type: AttributeValueType
}

export interface Category {
  code: string
  name: string
  parentId?: number
  image?: string
  attributes: AttributeValuePair[]
  id: number
  createdAt?: Date
  updatedAt?: Date
  children?: Category[]
}

export interface CategoryResponse extends RestResponse<Category[] | string> {
}
