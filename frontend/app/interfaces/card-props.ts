import {ZArticleListOutput} from '../../../shared/dto/article.dto';

export interface CardProps {
  title: string;
  content: ZArticleListOutput;
}

export interface CardPropsNotFound {
  title: string;
  ean: number;
}
