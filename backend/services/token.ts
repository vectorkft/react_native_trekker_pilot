import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../models/JwtPayload";
import Chalk from 'chalk';
import {zParse} from "../../shared/services/zod-dto.service";
import dotenv from "dotenv";
import {TokenDTOOutput, ZAccessTokenDTOInput, ZTokenDTOInput, ZTokenDTOOutput} from "../../shared/dto/token.dto";
import {errorMessageDTO} from "../../shared/dto/error-message-dto";
import {
    userPayLoadInput,
    ZUserLoginDTOInput,
    ZuserPayloadInput, ZUserSchemaInput
} from "../../shared/dto/user-login.dto";


const prisma = new PrismaClient()


dotenv.config()

export async function addTokenAtLogin(accessToken: ZAccessTokenDTOInput, refreshToken: ZTokenDTOInput, userInput: ZUserLoginDTOInput){
        const decodedAccessToken = jwt.decode(accessToken.accessToken) as JwtPayload;
        const decodedRefreshToken= jwt.decode(refreshToken.refreshToken) as JwtPayload;
        if (!decodedRefreshToken || !decodedAccessToken) {
            throw new Error('Cannot decode token');

        }

        await prisma.tokens_v2.create({
            data:
                {
                    accessToken: accessToken.accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken.refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userName: userInput.name,

                }
        })
        console.log('Tokens added')

}





export async function deleteExpiredTokens_new(){
    const currentTime = Math.floor(Date.now() / 1000);
    try{
        const deletedAccessTokens = await prisma.tokens_v2.updateMany({
            where: {
                accessExpireDate: {
                    lt: currentTime
                }
            },
            data : {
                accessToken:null,

            }
        });
        const deletedRefreshTokens = await prisma.tokens_v2.updateMany({
            where: {
                refreshExpireDate: {
                    lt: currentTime
                }
            },
            data : {
                refreshToken:null,

            }
        });
        const deleteTheWholeRecord = await prisma.tokens_v2.deleteMany({
            where: {
                accessExpireDate:{
                    lt: currentTime
                },
                refreshExpireDate:{
                    lt: currentTime
                }
            }
        })
        console.log(Chalk.green('-------------------------------'));
        console.log(Chalk.green('Deleted Access token(s) '+deletedAccessTokens.count + '\n'+'Deleted Refresh Token(s) '+deletedRefreshTokens.count));
        console.log(Chalk.green('Deleted record(s) ' +deleteTheWholeRecord.count));
        console.log(Chalk.green('-------------------------------'));

    } catch (err){
        console.log(err);
    }


}

export async function deleteTokensByLogout(accessToken:ZAccessTokenDTOInput){

        return prisma.tokens_v2.deleteMany({
            where: {
                accessToken: accessToken.accessToken
            }
        });
}


export async function refreshToken(refreshToken: ZTokenDTOInput) {

        if(!await isRefreshTokenInDatabase({refreshToken :refreshToken.refreshToken})){
            return await zParse(errorMessageDTO,{errorMessage: 'You tried to use AccessToken as RefreshToken'});
        }

        const payload= await retrieveUserInfoFromRefreshToken(refreshToken);

        const accessToken = await signTokensFromTokenPayload('accessToken','ACCESS_TOKEN_EXPIRE',payload);

        const decodedAccessToken=jwt.decode(accessToken) as JwtPayload;

        await prisma.tokens_v2.updateMany({
            where: { userName: payload.name },
            data: { accessToken: accessToken, accessExpireDate: decodedAccessToken.exp },
        });

        const body : ZTokenDTOOutput = await zParse(TokenDTOOutput, {newAccessToken: accessToken });

        return body;

}



async function isRefreshTokenInDatabase(refreshToken: ZTokenDTOInput): Promise<boolean> {

    return prisma.tokens_v2.findFirst({
        where: {
            refreshToken: refreshToken.refreshToken
        }
    }).then(token => !!token);
}

export async function signTokens(tokenType: string, expiresIn: string, userInput: ZUserSchemaInput){

    return jwt.sign(
        {name: userInput.name, szemelykod: 1, tokenType},
        process.env.JWT_SECRET_KEY ?? '',
        {expiresIn: process.env[expiresIn] ?? '1h'}
    );
}

export async function signTokensFromTokenPayload(tokenType: string, expiresIn: string, userInput: ZuserPayloadInput){
    return jwt.sign(
        {name: userInput.name, szemelykod: userInput.szemelykod, tokenType},
        process.env.JWT_SECRET_KEY ?? '',
        {expiresIn: process.env[expiresIn] ?? '1h'}
    );

}

export async function isAccessTokenInDatabase(accessToken: ZAccessTokenDTOInput):Promise<boolean>{
    return prisma.tokens_v2.findFirst({
        where: {
            accessToken: accessToken.accessToken
        }
    }).then(token => !!token);

}

async function retrieveUserInfoFromRefreshToken(token: ZTokenDTOInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.refreshToken,secretKey);
    return zParse(userPayLoadInput,{name: payload.name,szemelykod: payload.szemelykod});


}