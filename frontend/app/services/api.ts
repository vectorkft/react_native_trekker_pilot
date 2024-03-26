import {API_URL} from '../../config';
import {zParse} from '../../../shared/services/zod';
import {AnyZodObject, z, ZodObject} from 'zod';
import * as Sentry from '@sentry/react-native';
import {
  ApiResponse,
  RESPONSE_BAD_GATEWAY,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NO_AUTH,
  RESPONSE_NO_CONTENT,
  RESPONSE_UNAUTHORIZED,
} from '../constants/response-status';
import {ApiResponseOutput} from '../interfaces/api-response';

const createRequestInit = (options: any = {}): RequestInit => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }

  return {
    method: options.method,
    headers: headers,
    body: options.body,
  };
};

export const ApiService = {
  doRequest: async (
    endpoint: string,
    requestOptions: RequestInit = {},
    schema?: AnyZodObject,
  ): Promise<ApiResponseOutput> => {
    const url = `${API_URL}${endpoint}`;
    const response: Response = await fetch(
      url,
      createRequestInit(requestOptions),
    );
    let data: z.infer<ZodObject<any, any, any>>;

    switch (response.status) {
      case RESPONSE_INTERNAL_SERVER_ERROR: {
        const error = new Error(RESPONSE_INTERNAL_SERVER_ERROR.toString());
        Sentry.captureException(error);
        throw error;
      }

      case RESPONSE_BAD_GATEWAY: {
        const error = new Error(RESPONSE_BAD_GATEWAY.toString());
        Sentry.captureException(error);
        throw error;
      }

      case RESPONSE_NO_CONTENT:
        return ApiResponse.NO_CONTENT;

      case RESPONSE_NO_AUTH:
        return ApiResponse.NO_AUTH;

      case RESPONSE_UNAUTHORIZED:
        return ApiResponse.UNAUTHORIZED;

      default:
        data = await response.json();
        if (schema && response.ok) {
          try {
            data = await zParse(schema, data);
          } catch (error) {
            Sentry.captureException(error);
            throw error;
          }
        }
    }

    return {
      data: data,
      status: response.status,
    };
  },
};
