import {RestResponse} from './RestResponse';


export interface WpMedia {
  id: number
  source_url: string
}
export interface WpMediaResponse extends RestResponse<WpMedia | string> {
}
