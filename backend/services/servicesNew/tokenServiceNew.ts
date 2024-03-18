import {
    RefreshBodyErrorMessage, refreshTokenDTOOutput,
    ZAccessTokenInput,
    ZrefreshTokenInput,
    ZrefreshTokenOutput
} from "../../../shared/dto/refresh.token.dto";
import {userSchemaInput, ZUserSchemaInput} from "../../../shared/dto/user.dto";
import jwt, {JsonWebTokenError} from "jsonwebtoken";
import {JwtPayload} from "../../models/JwtPayload";
import {dbConnect} from "./dbConnectService";
import {zParse} from "../../../shared/services/zod-dto.service";
import {undefined, unknown} from "zod";


export async function addTokenAtLogin(accessToken: ZAccessTokenInput, refreshToken: ZrefreshTokenInput, userInput: ZUserSchemaInput){
    const decodedAccessToken = jwt.decode(accessToken.accessToken) as JwtPayload;
    const decodedRefreshToken= jwt.decode(refreshToken.refreshToken) as JwtPayload;
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

export async function deleteTokensByLogout_new(accessToken:ZAccessTokenInput){

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

export async function retrieveUserInfoFromAccessToken(token: ZAccessTokenInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.accessToken,secretKey);
    return zParse(userSchemaInput,{name: payload.name, pw: payload.pw});

}

async function retrieveUserInfoFromRefreshToken(token: ZrefreshTokenInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.refreshToken,secretKey);
    return zParse(userSchemaInput,{name: payload.name, pw: payload.pw});


}


export async function refreshToken_new(refreshToken: ZrefreshTokenInput) {

    if(!await isRefreshTokenInDatabase({refreshToken :refreshToken.refreshToken})){
        return await zParse(RefreshBodyErrorMessage,{errorMessage: 'You tried to use AccessToken as RefreshToken'});
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
        const body : ZrefreshTokenOutput = await zParse(refreshTokenDTOOutput, { message: 'New access token generated', newAccessToken: newAccessToken });
        return body;
    } catch (err) {
        console.log(`An error occurred during refreshing the access token ${err}`);
        return zParse(RefreshBodyErrorMessage,
            {errorMessage: (err instanceof JsonWebTokenError) ? err.message : JSON.stringify(err)});
    }
}



async function isRefreshTokenInDatabase(refreshToken: ZrefreshTokenInput): Promise<boolean> {
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
