import { z } from 'zod';
import { ean } from 'luhn-validation';

const article =z.object({
    cikkszam: z.number(),
    cikknev: z.string(),
    eankod: z.number().refine(value => value.toString().length === 13, {
        message: "Az EAN kód pontosan 13 karakter hosszú kell legyen.",
    }).refine(value => ean(value), {
        message: 'Nem valid EAN kód',
    }),
});

export class ProductDto {
    message: string;
    cikkszam: number;
    cikknev: string;
    eankod: number;

    constructor(cikkszam: number, cikknev: string, eankod: number) {
            this.cikkszam = cikkszam;
            this.cikknev = cikknev;
            this.eankod = eankod;


    }
}
