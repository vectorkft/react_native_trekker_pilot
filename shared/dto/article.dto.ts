import {z} from "zod";
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

export const ArticleDataOutput = z.object({
    key: z.string(),
    title: z.string(),
    value: z.string(),
});



export const cikkEANSchemaInput = z.object({

    eankod: z.number().refine(value => value.toString().length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!.')
        .refine(value => ean(value),'Nem valid EAN kód'),
});
export const cikkSzamSchemaInput = z.object({

    cikkszam: z.number(),
});


export const ArticleListOutput = z.object({
    data: z.array(ArticleDataOutput),
    count: z.number(),
});

export type ZArticleDTOOutput2 = z.infer<typeof ArticleDTOOutput2>
export type ZArticleDTOOutput = z.infer<typeof ArticleDTOOutput>
export type ZcikkEANSchemaInput = z.infer<typeof cikkEANSchemaInput>
export type ZcikkSzamSchemaInput = z.infer<typeof cikkSzamSchemaInput>




