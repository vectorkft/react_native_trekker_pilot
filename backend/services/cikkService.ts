import {PrismaClient} from "@prisma/client";
import {
    ArticleDataOutput,
    ArticleListOutput,
    ZcikkEANSchemaInput, ZcikkSzamSchemaInput,
} from "../../shared/dto/article.dto";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: ZcikkSzamSchemaInput) {
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


export async function getCikkByEanKod(eankod: ZcikkEANSchemaInput){
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
            ArticleDataOutput.parse({
                key: 'cikkszam',
                title: 'Cikkszám',
                value: articleElement.cikkszam.toString(),
            }),
            ArticleDataOutput.parse({
                key: 'cikknev',
                title: 'Cikknév',
                value: articleElement.cikknev.toString(),
            }),
            ArticleDataOutput.parse({
                key: 'eankod',
                title: 'EAN Kód',
                value: articleElement.eankod.toString(),
            }),
        ]),
        count: articles.length
    }
    return ArticleListOutput.parse(result);
}