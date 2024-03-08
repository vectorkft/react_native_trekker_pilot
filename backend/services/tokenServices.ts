import {PrismaClient} from "@prisma/client";
import jwt, {JsonWebTokenError} from "jsonwebtoken";
import {JwtPayload} from "../models/JwtPayload";

import {zParse} from "../../shared/services/zod-dto.service";
import {
    RefreshBodyErrorMessage,
    refreshTokenDTOOutput,
    ZAccessTokenInput,
    ZrefreshTokenInput,
    ZrefreshTokenOutput
} from "../../shared/dto/refresh.token.dto";
import {ZUserIdInput} from "../../shared/dto/user.dto";
import dotenv from "dotenv";


const prisma = new PrismaClient()


dotenv.config()

export async function addTokenAtLogin(accessToken: ZAccessTokenInput, refreshToken: ZrefreshTokenInput, userId: ZUserIdInput){
    const decodedAccessToken = jwt.decode(accessToken.accessToken) as JwtPayload;
    const decodedRefreshToken= jwt.decode(refreshToken.refreshToken) as JwtPayload;
    if (!decodedRefreshToken || !decodedAccessToken) {
        throw new Error('Cannot decode token');

    }
    try{
        await prisma.tokens_v1.create({
            data:
                {
                    accessToken: accessToken.accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken.refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userId: userId.userId

                }
        })
        console.log('Tokens added')
    } catch (err){
        console.log(err);
    }

}




export async function deleteExpiredTokens_new(){
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
        console.log('Deleted Access token(s) '+deletedAccessTokens.count + ' || '+'Deleted Refresh Token(s) '+deletedRefreshTokens.count);
        console.log('Deleted record(s) ' +deleteTheWholeRecord.count);

    } catch (err){
        console.log(err);
    }



}

export async function deleteTokensByLogout_new(accessToken:ZAccessTokenInput){
    try{
       await prisma.tokens_v1.deleteMany({
           where: {
               accessToken: accessToken.accessToken
           }
       })
    } catch (err){
        console.log(err);
    }


}

export async function deleteTokensByUserId(userId:ZUserIdInput){
    try {
        return await prisma.tokens_v1.deleteMany({
            where: {
                userId: userId.userId
            }
        });
    } catch (err){

    }
}

export async function refreshToken_new(refreshToken: ZrefreshTokenInput) {
    //Így megtudom fogni hogy ne lehessen accessTokennel is kérni a refresht
    if(!await isRefreshTokenInDatabase({refreshToken :refreshToken.refreshToken})){
        return await zParse(RefreshBodyErrorMessage,{errorMessage: 'You tried to use AccessToken as RefreshToken'});
    }
    const expireDate= Math.floor(Date.now() / 1000) + 30;
    const secretKey = process.env.JWT_SECRET_KEY ?? ''
    try {
        const payload: any = jwt.verify(refreshToken.refreshToken, secretKey);
        const newAccessToken = jwt.sign(
            { name: payload.name, pw: payload.pw, id: payload.id},
            secretKey,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE ?? '30min' }
        );
        await prisma.tokens_v1.updateMany({
            where: { userId: payload.id },
            data: { accessToken: newAccessToken, accessExpireDate: expireDate },
        });
        const body : ZrefreshTokenOutput = await zParse(refreshTokenDTOOutput, { message: 'New access token generated', newAccessToken: newAccessToken });
        return body;
    } catch (err) {
        console.log(`An error occurred during refreshing the access token ${err}`);
        return await zParse(RefreshBodyErrorMessage,
            {errorMessage: (err instanceof JsonWebTokenError) ? err.message : JSON.stringify(err)});
    }
}



async function isRefreshTokenInDatabase(refreshToken: ZrefreshTokenInput): Promise<boolean> {
      // Convert the token object to boolean
    return prisma.tokens_v1.findFirst({
        where: {
            refreshToken: refreshToken.refreshToken
        }
    }).then(token => !!token);
}

export async function isAccessTokenInDatabase(accessToken: ZAccessTokenInput): Promise<boolean> {
    // Convert the token object to boolean
    return prisma.tokens_v1.findFirst({
        where: {
            accessToken: accessToken.accessToken
        }
    }).then(token => !!token);
}