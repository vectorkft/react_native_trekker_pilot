import {ZProductListOutput} from '../../../shared/dto/product.dto';

export interface VcardSuccess {
  title: string;
  content: ZProductListOutput;
}

export interface VCardNotFound {
  title: string;
  value: string;
}
