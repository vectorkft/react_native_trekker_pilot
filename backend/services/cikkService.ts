import {PrismaClient} from "@prisma/client";
import {CikkNotFoundDTO} from "../dto/cikkNotFoundDTO";
import {
    ArticleDataOutput,
    ArticleDTOOutput,
    ArticleListOutput,
    ZArticleDTOOutput,
    ZcikkEANSchemaInput,
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

export async function getCikkByEanKod2(eankod: number){

    try{
        const cikk  = await prisma.cikk.findMany({
            where: {
                eankod: eankod
            }
        })
        if(cikk.length===0){
            return new CikkNotFoundDTO('Not found',eankod);
        }
        const result: {data:any, count:number} = {
            data: [],
            count: 0
        };
        for(let i = 0; i < cikk.length; i++){
            const temp = [
                ArticleDataOutput.parse({
                    key: 'cikkszam',
                    title: 'Cikkszám',
                    value: cikk[i].cikkszam.toString(),
                }),
                ArticleDataOutput.parse({
                    key: 'cikknev',
                    title: 'Cikknév',
                    value: cikk[i].cikknev.toString(),
                }),
                ArticleDataOutput.parse({
                    key: 'eankod',
                    title: 'EAN Kód',
                    value: cikk[i].eankod.toString(),
                }),
            ];
            result.data.push(...temp);
            result.count += 1;
        }

        return ArticleListOutput.parse(result);

    } catch (err:any) {
        console.log(err)
        throw err;
    }
}