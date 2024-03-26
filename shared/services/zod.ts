import {AnyZodObject, z, ZodArray, ZodError, ZodObject} from "../node_modules/zod";
import {ValidationResult} from "../interfaces/validation-result"
import * as Sentry from '../node_modules/@sentry/react';
import {ValidatorProps} from "../interfaces/validator";
import {ValidatedValue} from "../../frontend/app/interfaces/types";

export async function zParse<T extends AnyZodObject | ZodArray<ZodObject<any>>>(
    schema: T,
    data: Request | any,
): Promise<z.infer<T>> {
    try {
        return schema.parseAsync(data);
    } catch (error) {
        if (error instanceof ZodError) {
            Sentry.captureException(new Error(error.message));
        }
        return new Error(JSON.stringify(error));
    }
}

export async function parseZodError(error: ZodError) : Promise<string> {
    try {
        const msg = JSON.parse(error.message);
        const messages = msg.map((m: any) => m.message);
        return messages.join(', ');
    } catch (e) {
        Sentry.withScope(scope => {
            scope.setContext('myContext', { info: 'Hiba az üzenet feldolgozásakor.' });
            Sentry.captureException(error);
        });
        return '';
    }
}

export async function validateZDTOForm<T extends AnyZodObject>(
    schema: T,
    formData: z.infer<T>,
    handleError?: (error: ZodError) => {},
): Promise<ValidationResult> {
    try {
        await zParse(schema, formData);
    } catch (error) {
        Sentry.captureException(error);
        if (handleError){
            handleError(error as ZodError);
        }else {
            return {
                error: error as ZodError,
                isValid: false,
            };
        }
    }

    return {
        error: null,
        isValid: true,
    };
}

export const validateFormArray = async (
    value: string,
    rules: ValidatorProps,
    handleError: (error: ZodError) => {},
    handleSuccess: (formData: ValidatedValue) => Promise<any>,
): Promise<void> => {
    const validTypes: string[] = [];
    let error: ZodError | null = null;

    for (let i = 0; i < rules.propList.length; i++) {
        const {parseType} = rules.propList[i];
        const validation = await validateZDTOForm(parseType, {value: value});

        if (validation.isValid) {
            validTypes.push(rules.propList[i].name);
        }

        if (validation.error) {
            error = validation.error;
        }
    }

    if(validTypes.length === 0){
        handleError(error as ZodError);
    }else {
        await handleSuccess({value: value, validTypesArray: validTypes});
    }
};




export async function parseZodError_backend(error: ZodError) : Promise<string> {
    try {
        return error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', ');
    } catch (e) {
        Sentry.withScope(scope => {
            scope.setContext('parseZodError', { info: 'Hiba az üzenet feldolgozásakor.' });
            Sentry.captureException(e);
        });
        return '';
    }
}



