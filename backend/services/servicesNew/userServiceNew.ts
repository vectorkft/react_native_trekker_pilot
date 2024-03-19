import {
    userLoginDTOOutputNew,
    ZUserSchemaInput
} from "../../../shared/dto/user.dto";
import {dbConnect} from "./dbConnectService";
import {zParse} from "../../../shared/services/zod-dto.service";
import * as tokenServiceNew from "./tokenServiceNew";


export async function loginWithDB(userInput: ZUserSchemaInput) {

        const prismaA =await dbConnect(userInput);
        const user= await prismaA.pilot_user.findFirst({
            where: {name: userInput.name, pw: userInput.pw}
        });

        if(!user){
            return ['User not found'];
        }

        const accessToken= await tokenServiceNew.signTokens('accessToken','ACCESS_TOKEN_EXPIRE',userInput);

        const refreshToken= await tokenServiceNew.signTokens('refreshToken','REFRESH_TOKEN_EXPIRE',userInput);

        await tokenServiceNew.addTokenAtLogin({accessToken}, {refreshToken}, userInput);

        return zParse(userLoginDTOOutputNew, {
            message: 'Login Success, token added successfully',
            accessToken: accessToken,
            refreshToken,
            userName: userInput.name,
        });

}