import {PrismaClient} from "@prisma/client";
import {
    ProductDataOutput,
    ProductEANSchemaInput,
    ProductListOutput, ProductNumberSchemaInput,
    ZProductEANSchemaInput,
    ZProductGeneralSchema,
    ZProductNumberSchemaInput,
} from "../../shared/dto/product";
import {zParse} from "../../shared/services/zod";
import {ValidTypes} from "../../shared/enums/types";
import {Product} from "../interface/product";

const prisma = new PrismaClient()




export async function getCikkByCikkszam(input: ZProductNumberSchemaInput) {
    const cikk = await prisma.raktar_eancikkek.findMany({
        where: {
            etk: input.value
        }
    })
    if (cikk.length===0) {
        return false;
    }
    return processProducts(cikk);

}

export async function getCikkByEanKod(input: ZProductEANSchemaInput){
    const cikk = await prisma.raktar_eancikkek.findMany({
        where: {
            jellemzo: input.value
        }
    });
    if (cikk.length === 0) {
        return false;
    }
    return processProducts(cikk);


}

const processProducts = (products: Product[]) => {
    const result = {
        data: products.flatMap((articleElement) => [
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
        count: products.length
    }
    return ProductListOutput.parse(result);
}

export async function getCikkHelper(input: ZProductGeneralSchema) {
    const validType = input.validTypesArray.propList[0].type;

    switch (validType) {
        case ValidTypes.ean:

            return getCikkByEanKod(await zParse(ProductEANSchemaInput, input));

        case ValidTypes.etk:

            return getCikkByCikkszam(await zParse(ProductNumberSchemaInput, input));

        default:

            return 'Invalid validType';
    }
}