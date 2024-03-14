import {ZUserSchemaInput} from "../../shared/dto/user.dto";
import {PrismaClient} from "@prisma/client";

export async function dbConnect(userInput: ZUserSchemaInput){
    try{
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: `sqlserver://127.0.0.1:1433;database=trekker_local;user=${userInput.name};password=${userInput.pw};hostname=trekker;trustServerCertificate=true`
                },
            },
        })
        return prisma;
    } catch(err){
        console.log(err);
        return 'Failed to connect to the database';
    }

}