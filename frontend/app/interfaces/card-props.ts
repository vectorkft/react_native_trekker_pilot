import {ZArticleDTOOutputData} from '../../../shared/dto/article.dto';

export interface CardProps {
  title: string;
  content: ZArticleDTOOutputData;
}

export interface CardPropsNotFound {
  title: string;
  ean: number;
}
