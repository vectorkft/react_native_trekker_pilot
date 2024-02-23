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