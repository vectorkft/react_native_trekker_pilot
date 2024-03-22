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

export async function getCikkHelper(input: ZProductGeneralSchema){
    if(input.validTypesArray.includes(ValidTypes.ean)){

        const validData= await zParse(ProductEANSchemaInput, input);

        return await getCikkByEanKod(validData);

    }else if(input.validTypesArray.includes(ValidTypes.etk)){

        const validData= await zParse(ProductNumberSchemaInput, input);

        return await getCikkByCikkszam(validData);
    }
    return 'Invalid validType';


}