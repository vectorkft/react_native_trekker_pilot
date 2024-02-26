import {AnyZodObject, z, ZodError} from "zod";

export async function zParse<T extends AnyZodObject>(
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

export async function parseZodError(error: any) : Promise<string> {
    try {
        const msg = JSON.parse(error.message);
        const messages = msg.map((m: any) => m.message);
        return messages.join(' , ');
    } catch (e) {
        console.log('Hiba a hibaüzenet feldolgozásakor:', e);
        return '';
    }
}
