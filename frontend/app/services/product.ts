import {ApiService} from './api';
import {
  ProductListOutput,
  ZProductListOutput,
  ZProductEANSchemaInput,
  ZProductNumberSchemaInput,
} from '../../../shared/dto/product.dto';
import {TokenHandlingService} from './token-handling';
import * as Sentry from '@sentry/react-native';

export const ProductService = {
  getProductByEAN: async (
    ean: ZProductEANSchemaInput,
  ): Promise<ZProductListOutput | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(ean),
      accessToken: await TokenHandlingService.getTokenIfValid(),
    };

    try {
      return await ApiService.doRequest(
        '/protected/product/getCikkByEAN',
        options,
        ProductListOutput,
      );
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  },
  getProductByNumber: async (
    productNumber: ZProductNumberSchemaInput,
  ): Promise<ZProductListOutput | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(productNumber),
      accessToken: await TokenHandlingService.getTokenIfValid(),
    };

    try {
      return await ApiService.doRequest(
        '/protected/product/getCikk',
        options,
        ProductListOutput,
      );
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  },
};
