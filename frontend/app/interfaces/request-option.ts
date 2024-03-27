export interface RequestOptions {
  accessToken?: string;
  headers?: {'Content-Type': string; Authorization: string};
  method?: string;
  body?: string;
}
