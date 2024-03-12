import {AnyZodObject, z, ZodArray, ZodError, ZodObject} from "zod";
import {ValidateForm} from "../../frontend/app/interfaces/validate-form"

export async function zParse<T extends AnyZodObject | ZodArray<ZodObject<any>>>(
    schema: T,
    data: Request | any,
): Promise<z.infer<T>> {
    try {
        return schema.parseAsync(data);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new Error(error.message);
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
        console.log('Hiba a hibaüzenet feldolgozásakor:', e);
        return '';
    }
}

export async function validateZDTOForm<T extends AnyZodObject>(
    schema: T,
    formData: z.infer<T>,
): Promise<ValidateForm> {
    try {
        const body: z.infer<T> = await zParse(schema, formData);
        console.log(body);
    } catch (error: any) {
        console.log(error);
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








