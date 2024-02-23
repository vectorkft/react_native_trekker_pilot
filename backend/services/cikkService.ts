import {PrismaClient} from "@prisma/client";
import {CikkNotFoundDTO} from "../dto/cikkNotFoundDTO";
import {
    ArticleDTOOutput,

    ZArticleDTOOutput,zParse

} from "../../shared/dto/article.dto";

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