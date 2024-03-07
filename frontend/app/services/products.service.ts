import {RequestInitFactory} from '../factory/request-init-factory';
import {
  ArticleDTOOutput2,
  cikkEANSchemaInput,
  ZArticleDTOOutput2,
  ZcikkEANSchemaInput,
} from '../../../shared/dto/article.dto';
import {zParse} from '../../../shared/services/zod-dto.service';
import {tokenHandlingService} from './token-handling.service';
import {
  UserLoginDTOInput,
  ZUserLoginDTOInput,
} from '../../../shared/dto/user-login.dto';
import {ValidateForm} from '../interfaces/validate-form';
const handleResponseStatus = async (
  response: any,
): Promise<ZArticleDTOOutput2 | false | Response | undefined> => {
  switch (response.status) {
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

  validateForm: async (
    formData: ZcikkEANSchemaInput,
  ): Promise<ValidateForm> => {
    try {
      const body: ZcikkEANSchemaInput = await zParse(
        cikkEANSchemaInput,
        formData,
      );
      console.log(body);
    } catch (error: any) {
      console.log(error);
      return {
        error: error,
        isValid: false,
      };
    }

    return {
      error: null,
      isValid: true,
    };
  },

  getArticlesByEAN: async (
    ean: ZcikkEANSchemaInput,
  ): Promise<ZArticleDTOOutput2 | false | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(ean),
      accessToken: await tokenHandlingService.getTokenIfValid(),
    };

    try {
      const response = await RequestInitFactory.doRequest(
        '/getCikkByEAN',
        options,
      );
      return await handleResponseStatus(response);
    } catch (e) {
      console.log('Az API nem elérhető', e);
    }
  },
};
