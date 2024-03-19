import {
    ProductDataOutput,
    ProductListOutput,
    ZProductEANSchemaInput,
    ZProductNumberSchemaInput
} from "../../../shared/dto/product.dto";
import {ZAccessTokenInput} from "../../../shared/dto/refresh.token.dto";
import {dbConnect} from "./dbConnectService";
import * as tokenServiceNew from "../servicesNew/tokenServiceNew"

export async function getCikkByCikkszam(cikkszam: ZProductNumberSchemaInput,accessToken: ZAccessTokenInput) {
    const userInput= await tokenServiceNew.retrieveUserInfoFromAccessToken(accessToken)
    const prismaA =await dbConnect(userInput);
    const cikk = await prismaA.raktar_eancikkek.findMany({
        where: {
            etk: cikkszam.cikkszam
        }
    })
    if (cikk.length===0) {
        return "Not found";
    }
    return processArticles(cikk);

}

export async function getCikkByEanKod(eankod: ZProductEANSchemaInput, accessToken: ZAccessTokenInput){
    const userInput= await tokenServiceNew.retrieveUserInfoFromAccessToken(accessToken)
    const prismaA =await dbConnect(userInput);

        const cikk = await prismaA.raktar_eancikkek.findMany({
            where: {
                jellemzo: eankod.eankod
            }
        });
        if (cikk.length === 0) {
            return false;
        }
        return processArticles(cikk);

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