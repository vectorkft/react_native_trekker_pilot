import {API_URL} from '../../config';
import {zParse} from '../../../shared/services/zod-dto.service';
import {AnyZodObject} from 'zod';

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
    const url: string = `${API_URL}${endpoint}`;
    const response: Response = await fetch(
      url,
      createRequestInit(requestOptions),
    );
    let data: any;
    if (
      response.status !== 204 &&
      response.status !== 403 &&
      response.status !== 401
    ) {
      data = await response.json();
      if (schema && response.ok) {
        try {
          data = await zParse(schema, data);
        } catch (error) {
          console.log('Hiba a válasz feldolgozásakor:', error);
        }
      }
    } else if (response.status === 403) {
      return {status: 403, error: 'Forbidden', data: null};
    } else if (response.status === 204) {
      return {status: 204, data: null};
    } else if (response.status === 401) {
      return {status: 401, error: 'Unauthorized', data: null};
    }
    return {
      ...data,
      status: response.status,
    };
  },
};
