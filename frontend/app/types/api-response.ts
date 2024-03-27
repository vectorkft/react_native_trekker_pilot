import {z, ZodObject} from 'zod';

export type ApiResponseType = {
  status: number;
  data: null;
  error?: string;
};

export type ApiResponseDict = Record<string, ApiResponseType>;

export type ApiResponseOutput =
  | {
      status: number;
      data: z.infer<ZodObject<any, any, any>>;
    }
  | ApiResponseType;
