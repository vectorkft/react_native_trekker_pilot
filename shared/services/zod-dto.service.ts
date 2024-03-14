import {AnyZodObject, z, ZodArray, ZodError, ZodObject} from "zod";
import {ValidateForm} from "../../frontend/app/interfaces/validate-form"
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
): Promise<ValidateForm> {
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

export async function validateZDTOForms<T extends AnyZodObject>(
    schemas: T[],
    formData: z.infer<T>,
): Promise<ValidateForm> {
    let aggregateError: z.ZodError | null = null;
    for (const schema of schemas) {
        try {
            const body: z.infer<T> = await zParse(schema, formData);
            Sentry.captureMessage("DTO body", body);
            return {
                error: null,
                isValid: true,
            };
        } catch (error: any) {
            Sentry.captureException(error);
            if (error instanceof z.ZodError) {
                aggregateError = error;
            }
        }
    }

    return {
        isValid: false,
        error: aggregateError,
    };
}








