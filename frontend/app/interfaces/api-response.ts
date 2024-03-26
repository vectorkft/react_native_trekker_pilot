import {z, ZodObject} from 'zod';
import {ApiResponseType} from '../constants/response-status';

export type ApiResponseOutput =
  | {
      status: number;
      data: z.infer<ZodObject<any, any, any>>;
    }
  | ApiResponseType;
