import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../models/JwtPayload";

import {zParse} from "../../shared/services/zod-dto.service";
import {
    RefreshBodyErrorMessage,
    refreshTokenDTOOutput,
    ZAccessTokenInput,
    ZrefreshTokenInput,
    ZrefreshTokenOutput
} from "../../shared/dto/refresh.token.dto";
import {userPayLoadInput, ZuserPayloadInput, ZUserSchemaInput} from "../../shared/dto/user.dto";
import dotenv from "dotenv";


const prisma = new PrismaClient()


dotenv.config()

export async function addTokenAtLogin(accessToken: ZAccessTokenInput, refreshToken: ZrefreshTokenInput, userInput: ZUserSchemaInput){
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




export async function deleteExpiredTokens(){
    const currentTime = Math.floor(Date.now() / 1000);
    try{
        const deletedAccessTokens = await prisma.tokens_v1.updateMany({
            where: {
                accessExpireDate: {
                    lt: currentTime
                }
            },
            data : {
                accessToken:null,

            }
        });
        const deletedRefreshTokens = await prisma.tokens_v1.updateMany({
            where: {
                refreshExpireDate: {
                    lt: currentTime
                }
            },
            data : {
                refreshToken:null,

            }
        });
        const deleteTheWholeRecord = await prisma.tokens_v1.deleteMany({
            where: {
                accessExpireDate:{
                    lt: currentTime
                },
                refreshExpireDate:{
                    lt: currentTime
                }
            }
        })
        console.log('-------------------------------');
        console.log('Deleted Access token(s) '+deletedAccessTokens.count + ' || '+'Deleted Refresh Token(s) '+deletedRefreshTokens.count);
        console.log('Deleted record(s) ' +deleteTheWholeRecord.count);
        console.log('-------------------------------');

    } catch (err){
        console.log(err);
    }



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
        console.log('Deleted Access token(s) '+deletedAccessTokens.count + ' || '+'Deleted Refresh Token(s) '+deletedRefreshTokens.count);
        console.log('Deleted record(s) ' +deleteTheWholeRecord.count);
        console.log('-------------------------------');

    } catch (err){
        console.log(err);
    }



}

export async function deleteTokensByLogout(accessToken:ZAccessTokenInput){

        return prisma.tokens_v2.deleteMany({
            where: {
                accessToken: accessToken.accessToken
            }
        });
}


export async function refreshToken(refreshToken: ZrefreshTokenInput) {

        if(!await isRefreshTokenInDatabase({refreshToken :refreshToken.refreshToken})){
            return await zParse(RefreshBodyErrorMessage,{errorMessage: 'You tried to use AccessToken as RefreshToken'});
        }

        const payload= await retrieveUserInfoFromRefreshToken(refreshToken);

        const accessToken = await signTokensFromTokenPayload('accessToken','ACCESS_TOKEN_EXPIRE',payload);

        const decodedAccessToken=jwt.decode(accessToken) as JwtPayload;

        await prisma.tokens_v2.updateMany({
            where: { userName: payload.name },
            data: { accessToken: accessToken, accessExpireDate: decodedAccessToken.exp },
        });

        const body : ZrefreshTokenOutput = await zParse(refreshTokenDTOOutput, { message: 'New access token generated', newAccessToken: accessToken });

        return body;

}



async function isRefreshTokenInDatabase(refreshToken: ZrefreshTokenInput): Promise<boolean> {

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

export async function isAccessTokenInDatabase(accessToken: ZAccessTokenInput):Promise<boolean>{
    return prisma.tokens_v2.findFirst({
        where: {
            accessToken: accessToken.accessToken
        }
    }).then(token => !!token);

}

async function retrieveUserInfoFromRefreshToken(token: ZrefreshTokenInput){

    const secretKey = process.env.JWT_SECRET_KEY?? '';
    const payload: any= jwt.verify(token.refreshToken,secretKey);
    return zParse(userPayLoadInput,{name: payload.name,szemelykod: payload.szemelykod});


}