import {PrismaClient} from "@prisma/client";
import {ZUserLoginDTOInput} from "../../shared/dto/user-login";

export async function dbConnectionCheck(userInput: ZUserLoginDTOInput){
    const prisma = await dbConnect(userInput);
    await prisma.sTATION.findFirst({
        where:{USERNEV: userInput.name }
    });
    await prisma.$disconnect();
}



export async function dbConnect(userInput: ZUserLoginDTOInput): Promise<PrismaClient> {

    return new PrismaClient({

        datasources: {
            db: {
                url: `sqlserver://127.0.0.1:1433;hostname=trekker;database=trekker_local;user=${userInput.name};password=${userInput.pw};trustServerCertificate=true`
            },
        },
    });

}