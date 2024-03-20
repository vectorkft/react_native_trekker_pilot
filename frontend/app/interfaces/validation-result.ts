import {ZodError} from 'zod';

export interface ValidationResult {
  error: ZodError | null;
  isValid: boolean;
  validTypes?: string[];
}
