import {ZUserSchemaInput} from "../../shared/dto/user.dto";
import {dbConnect} from "./servicesNew/dbConnectService";

export async function dbConnectionCheck(userInput: ZUserSchemaInput){
    const prisma = await dbConnect(userInput);
    const user = await prisma.pilot_user.findFirst({
        where:{ name: userInput.name, pw: userInput.pw}
    });
}