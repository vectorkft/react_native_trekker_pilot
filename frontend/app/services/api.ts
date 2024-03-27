import {API_URL} from '../../config';
import {zParse} from '../../../shared/services/zod';
import {AnyZodObject, z, ZodObject} from 'zod';
import {
  ApiResponse,
  RESPONSE_BAD_GATEWAY,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NO_AUTH,
  RESPONSE_NO_CONTENT,
  RESPONSE_UNAUTHORIZED,
} from '../constants/response-status';
import {ApiResponseOutput} from '../types/api-response';
import {RequestOptions} from '../interfaces/request-option';

const createRequestInit = (options: RequestOptions = {}): RequestInit => {
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
    requestOptions: RequestOptions = {},
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
        throw new Error(RESPONSE_INTERNAL_SERVER_ERROR.toString());
      }

      case RESPONSE_BAD_GATEWAY: {
        throw new Error(RESPONSE_BAD_GATEWAY.toString());
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
          data = await zParse(schema, data);
        }
    }

    return {
      data: data,
      status: response.status,
    };
  },
};
