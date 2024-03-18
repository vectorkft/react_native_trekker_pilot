import {
    userLoginDTOOutputNew,
    userLoginFailedOutput,
    ZUserSchemaInput
} from "../../../shared/dto/user.dto";
import {dbConnect} from "./dbConnectService";
import {zParse} from "../../../shared/services/zod-dto.service";
import jwt from "jsonwebtoken";
import * as tokenServiceNew from "./tokenServiceNew";


export async function loginWithDB(userInput: ZUserSchemaInput) {
    try{
        const prismaA =await dbConnect(userInput);
        const user= await prismaA.pilot_user.findFirst({
            where: {name: userInput.name, pw: userInput.pw}
        });
        if(user!==null){
            const now = Math.floor(Date.now() / 1000);
            const token = jwt.sign({name: user.name, pw: user.pw, tokenType: 'accessToken'},
                process.env.JWT_SECRET_KEY ?? '', {expiresIn: process.env.ACCESS_TOKEN_EXPIRE ?? '30min'});
            const refreshToken = jwt.sign({name: userInput.name, pw: userInput.pw, tokenType: 'refreshToken'},
                process.env.JWT_SECRET_KEY ?? '', {expiresIn: process.env.REFRESH_TOKEN_EXPIRE ?? '1h'});
            await tokenServiceNew.addTokenAtLogin({accessToken: token}, {refreshToken}, userInput);
            return zParse(userLoginDTOOutputNew, {
                message: 'Login Success, token added successfully',
                accessToken: token,
                refreshToken,
                userName: userInput.name,
                currentTime: now
            });
        }
        return ['User not found'];


    } catch (err){
        return zParse(userLoginFailedOutput,{errormessage:'Cannot connect to the database, wrong username or password'});
    }

}