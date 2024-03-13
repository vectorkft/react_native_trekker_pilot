import {ApiService} from './api.service';
import {
  ProductListOutput,
  ZProductListOutput,
  ZProductEANSchemaInput,
  ZProductNumberSchemaInput,
} from '../../../shared/dto/product.dto';
import {tokenHandlingService} from './token-handling.service';
import * as Sentry from "@sentry/react-native";

export const ProductsService = {
  getProductByEAN: async (
    ean: ZProductEANSchemaInput,
  ): Promise<ZProductListOutput | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(ean),
      accessToken: await tokenHandlingService.getTokenIfValid(),
    };

    try {
      return await ApiService.doRequest(
        '/protected/product/getCikkByEAN',
        options,
        ProductListOutput,
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  },
  getProductByNumber: async (
    productNumber: ZProductNumberSchemaInput,
  ): Promise<ZProductListOutput | Response | undefined> => {
    const options = {
      method: 'POST',
      body: JSON.stringify(productNumber),
      accessToken: await tokenHandlingService.getTokenIfValid(),
    };

    try {
      return await ApiService.doRequest(
        '/protected/product/getCikk',
        options,
        ProductListOutput,
      );
    } catch (e) {
      Sentry.captureException(e);
    }
  },
};
