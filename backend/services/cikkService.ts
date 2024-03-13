import {PrismaClient} from "@prisma/client";
import {
    ProductDataOutput,
    ProductDTOOutput,
    ProductListOutput,
    ZProductEANSchemaInput, ZProductNumberSchemaInput,
} from "../../shared/dto/article.dto";
import {zParse} from "../../shared/services/zod-dto.service";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(cikkszam: ZProductNumberSchemaInput) {
    const cikk = await prisma.cikk.findFirst({
        where: {
            cikkszam: cikkszam.cikkszam
        }
    })

    if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
        return "Not found";
    }

    return zParse(ProductDTOOutput, cikk);
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

        const result = {
            data: cikk.flatMap((cikkElement) => [
                ProductDataOutput.parse({
                    key: 'cikkszam',
                    title: 'Cikkszám',
                    value: cikkElement.cikkszam.toString(),
                }),
                ProductDataOutput.parse({
                    key: 'cikknev',
                    title: 'Cikknév',
                    value: cikkElement.cikknev.toString(),
                }),
                ProductDataOutput.parse({
                    key: 'eankod',
                    title: 'EAN Kód',
                    value: cikkElement.eankod.toString(),
                }),
            ]),
            count: cikk.length
        }

        return ProductListOutput.parse(result);
    }
    catch (err: unknown) {
        throw err;
    }
}