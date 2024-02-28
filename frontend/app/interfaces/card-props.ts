import {ZArticleDTOOutput2} from "../../../shared/dto/article.dto";

export interface CardProps {
    title: string;
    content: ZArticleDTOOutput2;
}

export interface CardPropsNotFound {
    title: string;
    ean: number;
}