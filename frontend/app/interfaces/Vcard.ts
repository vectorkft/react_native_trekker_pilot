import {ZProductListOutput} from '../../../shared/dto/product.dto';

export interface CardContent {
  title: string;
  content: ZProductListOutput;
}

export interface CardNotFound {
  title: string;
  value: string;
}
