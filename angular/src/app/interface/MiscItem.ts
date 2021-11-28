import {RestResponse} from './RestResponse';

export interface MiscItem {
  name: string;
  value: string;
}

export interface MiscItemResponse extends RestResponse<MiscItem | string> {
}
