import {RequestinitFactory} from "../factory/requestinit-factory";
import {
    ArticleDTOOutput2, ZArticleDTOOutput2,
    ZcikkEANSchemaInput,
} from '../../../shared/dto/article.dto';
import {zParse} from "../../../shared/services/zod-dto.service";
import {tokenHandlingService} from "./token-handling.service";
const handleResponseStatus = async (response: any) : Promise<ZArticleDTOOutput2|false|Response> => {
    switch(response.status) {
        case 200:
            return await zParse(ArticleDTOOutput2, response);
        case 204:
            return false;
        case 400:
            return response;
        default:
            console.log('Ismeretlen státusz: ', response.status);
    }
};

export const ProductsService = {

    getArticlesByEAN : async (ean: ZcikkEANSchemaInput) : Promise<ZArticleDTOOutput2|false|Response> => {
        const options = {
            method: 'POST',
            body: JSON.stringify(ean),
            accessToken: await tokenHandlingService.getTokenIfValid(),
        }

        try {
            const response= await RequestinitFactory.doRequest('/getCikkByEAN', options);
            return await handleResponseStatus(response);
        } catch (e) {
            console.log('Az API nem elérhető' , e);
        }
    }
}
