import {PrismaClient} from "@prisma/client";
import {z} from "zod";
import { ean } from 'luhn-validation';
import {CikkDTO} from "../dto/cikkDTO";
import {CikkNotFoundDTO} from "../dto/cikkNotFoundDTO";

const prisma = new PrismaClient()

const cikkEANSchema = z.object({

    eankod: z.number().refine(value => value.toString().length === 13, {
        message: "Az EAN kód pontosan 13 karakter hosszú kell legyen.",
    }).refine(value => ean(value),{
        message: 'Nem valid EAN kód',
    }),
});
const cikkSchema = z.object({

    cikkszam: z.number(),
});


export async function getCikkByCikkszam(cikkszam: number) {
    try{
        cikkSchema.parse({cikkszam:cikkszam});
        const cikk = await prisma.cikk.findFirst({
            where: {
                cikkszam: cikkszam
            }
        })
        if(!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod){
            return "Not found";
        }
        return new CikkDTO(cikk.cikkszam,cikk.cikknev,Number(cikk.eankod));
    } catch (err:any) {
        console.log(err)
        throw err;
    }


}

export async function getCikkByEanKod(eankod:number) {
    try{
        cikkEANSchema.parse({eankod:eankod});
        const cikk = await prisma.cikk.findFirst({
            where: {
                eankod: eankod
            }
        })
        if(!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod){
            return new CikkNotFoundDTO('Not found',eankod);
        }
        return new CikkDTO(cikk.cikkszam,cikk.cikknev,Number(cikk.eankod));
    } catch (err:any) {
        console.log(err)
        throw err;
    }
}