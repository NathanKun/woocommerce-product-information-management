import {RestResponse} from './RestResponse'
import {AttributeValuePair} from './AttributeValuePair';
import {ProductType} from '../enumeration/ProductType';
import {VariationConfiguration} from './VariationConfiguration';

export interface Product {
  id: number
  sku: string
  name: string
  menuOrder: number
  type: ProductType,
  categoryIds: number[]
  parent?: string,
  image?: string
  attributes: AttributeValuePair[]
  variationConfigurations: VariationConfiguration[]
  createdAt?: Date
  updatedAt?: Date
  matListItemSelected?: boolean
}

export interface ProductResponse extends RestResponse<Product[] | string> {
}
