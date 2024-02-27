import {ZodError} from "zod";

export interface ValidateForm {
    error: ZodError,
    isValid: boolean,
}