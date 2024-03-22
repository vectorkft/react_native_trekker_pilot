import {ZProductListOutput} from '../../../shared/dto/product';

export interface CardContent {
  title: string;
  content: ZProductListOutput;
}

export interface CardNotFound {
  title: string;
  value: string;
}
