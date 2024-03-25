import {z} from '../node_modules/zod';
import { ean } from 'luhn-validation';

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


const coerceTypeSchema = z.object({
    _def: z.object({
        schema: z.object({
            _def: z.object({
                checks: z.array(z.object({
                    kind: z.string(),
                    value: z.number(),
                    message: z.string()
                })).optional(),
                typeName: z.string(),
                coerce: z.boolean().optional()
            }),
            typeName: z.string().optional(),
            effect: z.object({
                type: z.string()
            }).optional()
        }).optional(),
        typeName: z.string(),
        coerce: z.boolean().optional()
    }),
    typeName: z.string().optional(),
    effect: z.object({
        type: z.string()
    }).optional()
}).optional();

const parseTypeSchema = z.object({
    _def: z.object({
        unknownKeys: z.string(),
        catchall: z.object({
            _def: z.object({
                typeName: z.string()
            })
        }),
        typeName: z.string()
    }),
    _cached: z.object({
        shape: z.object({
            value: coerceTypeSchema
        }),
        keys: z.array(z.string())
    })
});


export const ProductGeneralSchema = z.object({
    value: z.string(),
    validTypesArray: z.object({
        propList: z.array(z.object({
            type: z.string(),
            parseType: parseTypeSchema
        }))
    })
});

export const ProductListOutput = z.object({
    data: z.array(ProductDataOutput),
    count: z.number(),
});

export type ZProductEANSchemaInput = z.infer<typeof ProductEANSchemaInput>
export type ZProductNumberSchemaInput = z.infer<typeof ProductNumberSchemaInput>
export type ZProductListOutput = z.infer<typeof ProductListOutput>
export type ZProductGeneralSchema= z.infer<typeof ProductGeneralSchema>







