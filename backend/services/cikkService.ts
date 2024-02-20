import {PrismaClient} from "@prisma/client";
import  {Response} from 'express';
import {z} from "zod";
import { ean } from 'luhn-validation';

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


export async function getCikkByCikkszam(cikkszam: number,res : Response) {
    try{
        const validateParam=cikkSchema.parse({cikkszam : cikkszam});
        const cikk = await prisma.cikk.findFirst({
            where: {
                cikkszam: cikkszam
            }
        })
        if(!cikk){
            return res.status(404).json({
                message: 'A cikk nem található'
            })
        }
        return res.status(200).json(cikk);
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: 'Something went wrong',
            err: err
        })
    }


}

export async function getCikkByEanKod(eankod:number, res: Response) {
    try{
        const validateParam=cikkEANSchema.parse({eankod:eankod});
        const cikk = await prisma.cikk.findFirst({
            where: {
                eankod: eankod
            }
        })
        if(!cikk){
            return res.status(404).json({
                message: 'A cikk nem található'
            })
        }
        return res.status(200).json(cikk);
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: 'Something went wrong',
            err: err
        })
    }
}