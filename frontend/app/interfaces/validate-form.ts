import {ZodError} from 'zod';

export interface ValidateForm {
  error: ZodError | null;
  isValid: boolean;
  validType?: string | null;
}
