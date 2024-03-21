import jwt, {JsonWebTokenError} from "jsonwebtoken";
import {VPayload} from "../../models/VPayload";
import {dbConnect} from "./dbConnectService";
import {zParse} from "../../../shared/services/zod-dto.service";
import {TokenDTOOutput, ZAccessTokenDTOInput, ZTokenDTOInput} from "../../../shared/dto/token.dto";
import {errorMessageDTO} from "../../../shared/dto/error-message-dto";
import {userSchemaInput, ZUserSchemaInput} from "../../../shared/dto/user-login.dto";


export async function addTokenAtLogin(accessToken: ZAccessTokenDTOInput, refreshToken: ZTokenDTOInput, userInput: ZUserSchemaInput){
    const decodedAccessToken = jwt.decode(accessToken.accessToken) as VPayload;
    const decodedRefreshToken= jwt.decode(refreshToken.refreshToken) as VPayload;
    if (!decodedRefreshToken || !decodedAccessToken) {
        throw new Error('Cannot decode token');

    }
    try{
        const prismaA =await dbConnect(userInput);
        await prismaA.tokens_v2.create({
            data:
                {
                    accessToken: accessToken.accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken.refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userName: userInput.name

                }
        })
        console.log('Tokens added')
    } catch (err){
        console.log('error: '+err);
        return err;
    }

}

export async function deleteTokensByLogout_new(accessToken:ZAccessTokenDTOInput){

    try{
        const userInput= await retrieveUserInfoFromAccessToken(accessToken)
        const prismaA =await dbConnect(userInput);
        await prismaA.tokens_v2.deleteMany({
            where: {
                accessToken: accessToken.accessToken
            }
        })
    } catch (err){
        console.log(err);
    }


}

export async function retrieveUserInfoFromAccessToken(token: ZAccessTokenDTOInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.accessToken,secretKey);
    return zParse(userSchemaInput,{name: payload.name, pw: payload.pw});

}

async function retrieveUserInfoFromRefreshToken(token: ZTokenDTOInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.refreshToken,secretKey);
    return zParse(userSchemaInput,{name: payload.name, pw: payload.pw});


}


export async function refreshToken_new(refreshToken: ZTokenDTOInput) {

    if(!await isRefreshTokenInDatabase({refreshToken :refreshToken.refreshToken})){
        return await zParse(errorMessageDTO,{errorMessage: 'You tried to use AccessToken as RefreshToken'});
    }
    const expireDate= Math.floor(Date.now() / 1000) + 30;
    const secretKey = process.env.JWT_SECRET_KEY ?? '';

    try {
        const userInput= await retrieveUserInfoFromRefreshToken(refreshToken);
        const prismaA =await dbConnect(userInput);
        const newAccessToken = jwt.sign(
            { name: userInput.name, pw: userInput.pw},
            secretKey,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE ?? '30min' }
        );
        await prismaA.tokens_v2.updateMany({
            where: { userName: userInput.name },
            data: { accessToken: newAccessToken, accessExpireDate: expireDate },
        });
        return await zParse(TokenDTOOutput, {newAccessToken: newAccessToken});
    } catch (err) {
        console.log(`An error occurred during refreshing the access token ${err}`);
        return zParse(errorMessageDTO,
            {errorMessage: (err instanceof JsonWebTokenError) ? err.message : JSON.stringify(err)});
    }
}



async function isRefreshTokenInDatabase(refreshToken: ZTokenDTOInput): Promise<boolean> {
    const userInput= await retrieveUserInfoFromRefreshToken(refreshToken);
    const prismaA =await dbConnect(userInput);
    return prismaA.tokens_v2.findFirst({
        where: {
            refreshToken: refreshToken.refreshToken
        }
    }).then(token => !!token);
}


export async function signTokens(tokenType: string, expiresIn: string, userInput: ZUserSchemaInput){

    return jwt.sign(
        {name: userInput.name, pw: userInput.pw, tokenType},
        process.env.JWT_SECRET_KEY ?? '',
        {expiresIn: process.env[expiresIn] ?? '1h'}
    );
}
