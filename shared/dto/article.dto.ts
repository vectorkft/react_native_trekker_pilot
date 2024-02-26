import {AnyZodObject, z, ZodError} from "zod";
import { ean } from 'luhn-validation';
export const ArticleDTOOutput = z.object({
    cikkszam:z.number(),
    cikknev:z.string(),
    eankod: z.bigint(),



});

export const ArticleDTOOutput2 = z.object({
    cikkszam:z.number(),
    cikknev:z.string(),
    eankod: z.string(),



});

export const cikkEANSchemaInput = z.object({

    eankod: z.number().refine(value => value.toString().length === 13, {
        message: "Az EAN kód pontosan 13 karakter hosszú kell legyen!.",
    }).refine(value => ean(value),{
        message: 'Nem valid EAN kód',
    }),
});
export const cikkSzamSchemaInput = z.object({

    cikkszam: z.number(),
});

export type ZArticleDTOOutput2 = z.infer<typeof ArticleDTOOutput2>
export type ZArticleDTOOutput = z.infer<typeof ArticleDTOOutput>
export type ZcikkEANSchemaInput = z.infer<typeof  cikkEANSchemaInput>


export async function zParse<T extends AnyZodObject>(
    schema: T,
    data: any,
): Promise<z.infer<T>>{
    try{
        return schema.parseAsync(data);
    }catch(error){
        if(error instanceof ZodError){
            throw new Error(error.message);
        }
        return new Error(JSON.stringify(error));
    }
}


