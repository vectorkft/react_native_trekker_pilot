import {API_URL} from '../../config';

const getClient = (options: any = {}): RequestInit => {
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

export const RequestInitFactory = {
  doRequest: async (endpoint: string, requestOptions: any = {}) => {
    const url: string = `${API_URL}${endpoint}`;
    const response: Response = await fetch(url, getClient(requestOptions));
    let data: Response = response;
    if (response.status !== 204 && response.status !== 403) {
      data = await response.json();
    }
    return {
      ...data,
      status: response.status,
    };
  },
};
