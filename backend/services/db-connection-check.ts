
import {dbConnect} from "./servicesNew/dbConnectService";
import {ZUserSchemaInput} from "../../shared/dto/user-login.dto";

export async function dbConnectionCheck(userInput: ZUserSchemaInput){
    const prisma = await dbConnect(userInput);
    await prisma.pilot_user.findFirst({
        where:{ name: userInput.name, pw: userInput.pw}
    });
}