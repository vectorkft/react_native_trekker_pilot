import {ZodError} from 'zod';
import {ValidTypes} from '../../../shared/enums/types';

export interface ValidationResult {
  error: ZodError | null;
  isValid: boolean;
  validType?: ValidTypes.ean | ValidTypes.etk | ValidTypes.both;
}
