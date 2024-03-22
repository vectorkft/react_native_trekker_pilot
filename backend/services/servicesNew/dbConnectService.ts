
import {PrismaClient} from "@prisma/client";
import {ZUserSchemaInput} from "../../../shared/dto/user-login";

export async function dbConnect(userInput: ZUserSchemaInput): Promise<PrismaClient> {

        return new PrismaClient({

            datasources: {
                db: {
                    url: `sqlserver://127.0.0.1:1433;hostname=trekker;database=trekker_local;user=${userInput.name};password=${userInput.pw};trustServerCertificate=true`
                },
            },
        });

}