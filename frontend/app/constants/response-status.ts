import {ApiResponseDict} from '../types/api-response';

export const RESPONSE_SUCCESS = 200;
export const RESPONSE_NO_CONTENT = 204;
export const RESPONSE_NO_AUTH = 403;
export const RESPONSE_UNAUTHORIZED = 401;
export const RESPONSE_INTERNAL_SERVER_ERROR = 500;
export const RESPONSE_BAD_GATEWAY = 502;
export const NO_INTERNET_CONNECTION = 503;

export const ApiResponse: ApiResponseDict = {
  SUCCESS: {status: RESPONSE_SUCCESS, data: null},
  NO_CONTENT: {status: RESPONSE_NO_CONTENT, data: null},
  NO_AUTH: {status: RESPONSE_NO_AUTH, error: 'No Authorization', data: null},
  UNAUTHORIZED: {
    status: RESPONSE_UNAUTHORIZED,
    error: 'Unauthorized',
    data: null,
  },
  INTERNAL_SERVER_ERROR: {
    status: RESPONSE_INTERNAL_SERVER_ERROR,
    error: 'Internal Server Error',
    data: null,
  },
  BAD_GATEWAY: {status: RESPONSE_BAD_GATEWAY, error: 'Bad Gateway', data: null},
};
