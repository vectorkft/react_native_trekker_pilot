import {z} from "zod";
import { ean } from 'luhn-validation';


export const ProductDataOutput = z.object({
    key: z.string(),
    title: z.string(),
    value: z.string(),
});

export const ProductEANSchemaInput = z.object({
    eankod: z.string().refine(value => value.length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!.')
        .refine(value => ean(value),'Nem valid EAN kód'),
});

export const ProductNumberSchemaInput = z.object({
    cikkszam: z.string().refine(value => typeof value === 'string', 'Nem szöveget adtál meg!'),
});

export const ProductListOutput = z.object({
    data: z.array(ProductDataOutput),
    count: z.number(),
});

export type ZProductEANSchemaInput = z.infer<typeof ProductEANSchemaInput>
export type ZProductNumberSchemaInput = z.infer<typeof ProductNumberSchemaInput>
export type ZProductListOutput = z.infer<typeof ProductListOutput>




