import {z} from '../../node_modules/zod';
import { ean } from 'luhn-validation';
import {ValidTypes} from "../enums/types";


export const ProductDataOutput = z.object({
    key: z.string(),
    title: z.string(),
    value: z.string(),
});

export const ProductEANSchemaInput = z.object({
    value: z.string().refine(value => value.length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!')
        .refine(value => ean(Number(value)),'Nem valid EAN kód!'),
});

export const ProductNumberSchemaInput = z.object({
    value: z.string().min(1,'Minimum 1 karakter hosszúnak kell lennie a cikkszámnak!').max(21, 'Túl lépted a maximum 21 karaktert!'),
});

export const ProductGeneralSchema = z.object({
    value: z.string(),
    validType: z.enum([ValidTypes.ean,ValidTypes.both,ValidTypes.etk]).describe('Valid EAN type'),
});

export const ProductListOutput = z.object({
    data: z.array(ProductDataOutput),
    count: z.number(),
});

export type ZProductEANSchemaInput = z.infer<typeof ProductEANSchemaInput>
export type ZProductNumberSchemaInput = z.infer<typeof ProductNumberSchemaInput>
export type ZProductListOutput = z.infer<typeof ProductListOutput>
export type ZProductGeneralSchema= z.infer<typeof ProductGeneralSchema>




