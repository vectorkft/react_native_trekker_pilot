import {AnyZodObject, z, ZodArray, ZodError, ZodObject} from "zod";
import {ValidationResult} from "../../frontend/app/interfaces/validation-result"
import * as Sentry from '@sentry/react';

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
            scope.setContext('myContext', { info: 'Hiba az üzenet feldolgozásakor' });
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








