import {PrismaClient} from "@prisma/client";
import {CikkNotFoundDTO} from "../dto/cikkNotFoundDTO";
import {
    ArticleDTOOutput,

    ZArticleDTOOutput,

} from "../../shared/dto/article.dto";
import {zParse} from "../../shared/services/zod-dto.service";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: number) {
    try{


        const cikk = await prisma.cikk.findFirst({
            where: {
                cikkszam: cikkszam
            }
        })
        if(!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod){
            return "Not found";
        }

        const body :ZArticleDTOOutput = await zParse(ArticleDTOOutput,cikk)
        return body;
    } catch (err:any) {
        console.log(err)
        throw err;
    }


}

export async function getCikkByEanKod(eankod:number){
    try{
        const cikk = await prisma.cikk.findFirst({
            where: {
                eankod: eankod
            }
        })
        if(!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod){
            return new CikkNotFoundDTO('Not found',eankod);
        }
        console.log(typeof eankod)
        const body :ZArticleDTOOutput =await zParse(ArticleDTOOutput,cikk)

        return body;

    } catch (err:any) {
        console.log(err)
        throw err;
    }
}