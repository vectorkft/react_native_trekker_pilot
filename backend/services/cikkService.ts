import {PrismaClient} from "@prisma/client";
import {
    ProductDataOutput,
    ProductListOutput,
    ZProductEANSchemaInput, ZProductNumberSchemaInput,
} from "../../shared/dto/product.dto";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: ZProductNumberSchemaInput) {
    const cikk = await prisma.cikk.findMany({
        where: {
            cikkszam: cikkszam.cikkszam
        }
    })
    if (cikk.length===0) {
        return "Not found";
    }
    return processArticles(cikk);

}


export async function getCikkByEanKod(eankod: ZProductEANSchemaInput){
    try {
        const cikk = await prisma.cikk.findMany({
            where: {
                eankod: eankod.eankod
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
                key: 'cikkszam',
                title: 'Cikkszám',
                value: articleElement.cikkszam.toString(),
            }),
            ProductDataOutput.parse({
                key: 'cikknev',
                title: 'Cikknév',
                value: articleElement.cikknev.toString(),
            }),
            ProductDataOutput.parse({
                key: 'eankod',
                title: 'EAN Kód',
                value: articleElement.eankod.toString(),
            }),
        ]),
        count: articles.length
    }
    return ProductListOutput.parse(result);
}