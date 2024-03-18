import {ZUserSchemaInput} from "../../../shared/dto/user.dto";
import {PrismaClient} from "@prisma/client";

export async function dbConnect(userInput: ZUserSchemaInput): Promise<PrismaClient> {

        return new PrismaClient({
            log: ['info'],
            datasources: {
                db: {
                    url: `sqlserver://127.0.0.1:1433;hostname=trekker;database=trekker_local;user=${userInput.name};password=${userInput.pw};trustServerCertificate=true`
                },
            },
        });

}