import {ZProductListOutput} from '../../../shared/dto/product.dto';

export interface CardProps {
  title: string;
  content: ZProductListOutput;
}

export interface CardPropsNotFound {
  title: string;
  ean: number;
}
