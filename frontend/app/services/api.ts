import {API_URL} from '../../config';
import {zParse} from '../../../shared/services/zod';
import {AnyZodObject} from 'zod';
import * as Sentry from '@sentry/react-native';
import {NavigationService} from './navigation';
import {
  RESPONSE_NO_AUTH,
  RESPONSE_NO_CONTENT,
  RESPONSE_UNAUTHORIZED,
} from '../constants/response-status';

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
    requestOptions: any = {},
    schema?: AnyZodObject,
  ) => {
    const url = `${API_URL}${endpoint}`;
    const response: Response = await fetch(
      url,
      createRequestInit(requestOptions),
    );
    let data: any;
    if (
      response.status !== RESPONSE_NO_CONTENT &&
      response.status !== RESPONSE_NO_AUTH &&
      response.status !== RESPONSE_UNAUTHORIZED
    ) {
      data = await response.json();
      if (schema && response.ok) {
        try {
          data = await zParse(schema, data);
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    } else if (response.status === RESPONSE_NO_AUTH) {
      NavigationService.redirectToLogin();
      return {status: RESPONSE_NO_AUTH, error: 'Forbidden', data: null};
    } else if (response.status === RESPONSE_NO_CONTENT) {
      return {status: RESPONSE_NO_CONTENT, data: null};
    } else if (response.status === RESPONSE_UNAUTHORIZED) {
      return {status: RESPONSE_UNAUTHORIZED, error: 'Unauthorized', data: null};
    }
    return {
      ...data,
      status: response.status,
    };
  },
};
