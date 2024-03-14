import {PrismaClient} from "@prisma/client";
import {
    ProductDataOutput,
    ProductListOutput,
    ZProductEANSchemaInput, ZProductNumberSchemaInput,
} from "../../shared/dto/product.dto";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: ZProductNumberSchemaInput) {
    const cikk = await prisma.raktar_eancikkek.findMany({
        where: {
            etk: cikkszam.cikkszam
        }
    })
    if (cikk.length===0) {
        return "Not found";
    }
    return processArticles(cikk);

}


export async function getCikkByEanKod(eankod: ZProductEANSchemaInput){
    try {
        const cikk = await prisma.raktar_eancikkek.findMany({
            where: {
                jellemzo: eankod.eankod
            }
        });
        if (cikk.length === 0) {
            return false;
        }
        return processArticles(cikk);
    }
    catch (err: unknown) {
        throw err;
    }
}

const processArticles = (articles: any[]) => {
    const result = {
        data: articles.flatMap((articleElement) => [
            ProductDataOutput.parse({
                key: 'etk',
                title: 'ETK',
                value: articleElement.etk,
            }),
            ProductDataOutput.parse({
                key: 'cikknev',
                title: 'Cikknév',
                value: articleElement.CIKKNEV1,
            }),
            ProductDataOutput.parse({
                key: 'eankod',
                title: 'EAN Kód',
                value: articleElement.jellemzo,
            }),
        ]),
        count: articles.length
    }
    return ProductListOutput.parse(result);
}