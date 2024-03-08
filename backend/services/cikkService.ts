import {PrismaClient} from "@prisma/client";
import {
    ArticleDataOutput,
    ArticleDTOOutput,
    ArticleListOutput,
    ZcikkEANSchemaInput, ZcikkSzamSchemaInput,
} from "../../shared/dto/article.dto";
import {zParse} from "../../shared/services/zod-dto.service";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: ZcikkSzamSchemaInput) {
    const cikk = await prisma.cikk.findFirst({
        where: {
            cikkszam: cikkszam.cikkszam
        }
    })

    if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
        return "Not found";
    }

    return zParse(ArticleDTOOutput, cikk);
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

        const result = {
            data: cikk.flatMap((cikkElement) => [
                ArticleDataOutput.parse({
                    key: 'cikkszam',
                    title: 'Cikkszám',
                    value: cikkElement.cikkszam.toString(),
                }),
                ArticleDataOutput.parse({
                    key: 'cikknev',
                    title: 'Cikknév',
                    value: cikkElement.cikknev.toString(),
                }),
                ArticleDataOutput.parse({
                    key: 'eankod',
                    title: 'EAN Kód',
                    value: cikkElement.eankod.toString(),
                }),
            ]),
            count: cikk.length
        }

        return ArticleListOutput.parse(result);
    }
    catch (err: unknown) {
        throw err;
    }
}