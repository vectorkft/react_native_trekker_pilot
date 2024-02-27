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

export async function parseZodError(error: ZodError) : Promise<string> {
    try {
        const msg = JSON.parse(error.message);
        const messages = msg.map((m: any) => m.message);
        return messages.join(' , ');
    } catch (e) {
        console.log('Hiba a hibaüzenet feldolgozásakor:', e);
        return '';
    }
}

export async function parseResponseMessages(response: Response) : Promise<string> {
    try {
        let messages = [];
        for (let key in response) {
            if (response[key].message) {
                messages.push(response[key].message);
            }
        }
        return messages.join(' , ');
    } catch (e) {
        console.log('Hiba a válaszüzenetek feldolgozásakor:', e);
        return '';
    }
}








