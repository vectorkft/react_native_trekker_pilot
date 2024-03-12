import {ApiService} from './api.service';
import {
  ArticleListOutput,
  ZArticleListOutput,
  ZcikkEANSchemaInput,
} from '../../../shared/dto/article.dto';
import {tokenHandlingService} from './token-handling.service';

export const ProductsService = {
  getProductsByEAN: async (
    ean: ZcikkEANSchemaInput,
  ): Promise<ZArticleListOutput | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(ean),
      accessToken: await tokenHandlingService.getTokenIfValid(),
    };

    try {
      return await ApiService.doRequest(
        '/protected/product/getCikkByEAN',
        options,
        ArticleListOutput,
      );
    } catch (e) {
      console.log('Az API nem elérhető', e);
    }
  },
};
