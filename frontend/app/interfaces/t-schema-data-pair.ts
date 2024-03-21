import {AnyZodObject} from 'zod';

export type TSchemaDataPair = {
  schema: AnyZodObject;
  formData: {[key: string]: string};
};
