import {ZodError} from 'zod';

export interface ValidationResult {
  error: ZodError | null;
  isValid: boolean;
  validType?: string[];
}

export interface ValidatedValue {
  value: string;
  validTypesArray: string[];
}
