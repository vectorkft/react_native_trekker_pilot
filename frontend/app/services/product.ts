import {ApiService} from './api';
import {
  ProductListOutput,
  ZProductEANSchemaInput,
  ZProductNumberSchemaInput,
} from '../../../shared/dto/product';
import {TokenHandlingService} from './token-handling';
import * as Sentry from '@sentry/react-native';
import {ApiResponseOutput} from '../types/api-response';
import {ValidatedValue} from '../../../shared/interfaces/validation-result';

export const ProductService = {
  getProductByEAN: async (
    ean: ZProductEANSchemaInput,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<ApiResponseOutput | undefined> => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(ean),
        accessToken: await TokenHandlingService.getTokenIfValid(setError),
      };

      return await ApiService.doRequest(
        '/protected/product/getCikkByEAN',
        options,
        ProductListOutput,
      );
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  },
  getProductByNumber: async (
    productNumber: ZProductNumberSchemaInput,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<ApiResponseOutput | undefined> => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(productNumber),
        accessToken: await TokenHandlingService.getTokenIfValid(setError),
      };

      return await ApiService.doRequest(
        '/protected/product/getCikkByETK',
        options,
        ProductListOutput,
      );
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  },
  getProduct: async (
    value: ValidatedValue,
    setError: (error: any, changeValue?: boolean | undefined) => void,
  ): Promise<ApiResponseOutput | undefined> => {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(value),
        accessToken: await TokenHandlingService.getTokenIfValid(setError),
      };

      return await ApiService.doRequest(
        '/protected/product/getCikk',
        options,
        ProductListOutput,
      );
    } catch (error) {
      setError(error);
      Sentry.captureException(error);
    }
  },
};
