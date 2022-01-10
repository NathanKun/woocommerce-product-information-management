import {RestResponse} from './RestResponse'
import {AttributeValuePair} from './AttributeValuePair';
import {ProductType} from '../enumeration/ProductType';
import {VariationConfiguration} from './VariationConfiguration';
import {Subject} from 'rxjs';

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
  deletedAt?: Date
  matListItemSelected?: boolean
  collapsed?: boolean
  $highlight?: Subject<boolean>
  highlight?: boolean
}

export interface ProductListResponse extends RestResponse<Product[] | string> {
}

export interface ProductResponse extends RestResponse<Product | string> {
}
