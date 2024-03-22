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
): Promise<ValidationResult> {
    try {
        const body: z.infer<T> = await zParse(schema, formData);
        Sentry.captureMessage("DTO body", body);
    } catch (error: any) {
        Sentry.captureException(error);
        return {
            isValid: false,
            error: error,
        };
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
    const validTypes: ValidatorProps = {propList: []};
    let error: ZodError | null = null;

    for (let i = 0; i < rules.propList.length; i++) {
        const {parseType} = rules.propList[i];
        const validation = await validateZDTOForm(parseType, {value: value});

        if (validation.isValid) {
            validTypes.propList.push(rules.propList[i]);
        }

        if (validation.error) {
            error = validation.error;
        }
    }

    if(validTypes.propList.length === 0){
        handleError(error as ZodError);
    }else {
        await handleSuccess({value: value, validTypesArray: validTypes});
    }
};








