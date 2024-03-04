
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../models/JwtPayload";

import {zParse} from "../../shared/services/zod-dto.service";
import {refreshTokenDTOOutput, ZrefreshTokenOutput} from "../../shared/dto/refresh.token.dto";
import {MessageDTO} from "../dto/messageDTO";


const prisma = new PrismaClient()




export async function addTokenAtLogin(accessToken: string, refreshToken: string, userId: number){
    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    const decodedRefreshToken= jwt.decode(refreshToken) as JwtPayload;
    if (!decodedRefreshToken || !decodedAccessToken) {
        throw new Error('Cannot decode token');
    }
    try{
        await prisma.tokens_v1.create({
            data:
                {
                    accessToken: accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userId: userId

                }
        })
        console.log('Tokens added')
    } catch (err){
        console.log(err);
    }

}

export async function refreshToken_new(refreshToken: string){
    const expireDate= Math.floor(Date.now() / 1000) + 30;
    const secretKey = process.env.JWT_SECRET_KEY ?? ''

    return new Promise(async (resolve, reject) => {
        jwt.verify(refreshToken, secretKey, async (err: any, payload: any) => {
            if (err) {
                console.log('Invalid token ' + err);
                resolve(new MessageDTO('Invalid token ' +err));
            } else {
                const newAccessToken = jwt.sign({name: payload.name, pw: payload.pw, id: payload.id},
                    secretKey, { expiresIn: "30s" });

                try {
                    await prisma.tokens_v1.updateMany({
                        where: {
                            userId: payload.id
                        },
                        data: {
                            accessToken: newAccessToken,
                            accessExpireDate: expireDate
                        },
                    })
                    console.log('Access token successfully refreshed');
                    const body :ZrefreshTokenOutput = await zParse(refreshTokenDTOOutput,{message:'New access token generated', newAccessToken: newAccessToken});
                    resolve(body);
                } catch (err) {
                    console.log('An error occurred during refreshing the access token');
                    resolve(new MessageDTO('Invalid token'));
                }
            }
        });
    });
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

export async function deleteTokensByLogout_new(accessToken:string){
    try{
       await prisma.tokens_v1.deleteMany({
           where: {
               accessToken: accessToken
           }
       })
    } catch (err){
        console.log(err);
    }


}

export async function deleteTokensByUserId(userId:number){
    try {
        return await prisma.tokens_v1.deleteMany({
            where: {
                userId: userId
            }
        });
    } catch (err){

    }
}






// export async function addToken(token: string, userId: number, res : Response, currentTime: number,tokenType: string){
//     try{
//         await prisma.tokens.create({
//             data: {
//                 token: token,
//                 user_id: userId,
//                 created_at: currentTime,
//                 token_type: tokenType
//             },
//         })
//
//         console.log(tokenType+' added successfully: '+token);
//     } catch (err) {
//         console.log('Something went wrong: ' + err)
//         return res.status(401).json({
//             message: 'Something went wrong',
//             err: err
//         })
//     }
//
//
//
// }
//
//
// export async function deleteExpiredTokens(){
//     const fiveMinutesAgo = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
//     const thirtySecondsAgo = Math.floor((Date.now() - 30 * 1000) / 1000);
//
//     const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
//     try {
//         const deleteExpiredTokens = await prisma.tokens.deleteMany({
//             where: {
//                 created_at: {
//                     lt: thirtySecondsAgo
//                 },
//                 token_type: 'accessToken'
//             }
//         })
//         const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
//             where: {
//                 created_at: {
//                     lt: oneDayAgo
//                 },
//                 token_type: 'refreshToken'
//             }
//         })
//         console.log('Deleted accessToken(s): ' + deleteExpiredTokens.count + ' Deleted refreshToken(s): '
//         + deleteExpiredRefreshTokens.count);
//     } catch (err) {
//         console.log('Something went wrong when deleting tokens:' + err)
//     }
//
// }
//
// export function refreshToken(refreshToken : string , res: Response){
//     try{
//         const validateParam=tokenSchema.parse({refreshToken: refreshToken})
//         const now = Math.floor(new Date().getTime() / 1000);
//         const secretKey = process.env.JWT_SECRET_KEY ?? ''
//
//
//         jwt.verify(refreshToken, secretKey, async (err: any, payload: any) => {
//             if (err) {
//                 console.log('Invalid token ' + err);
//                 return res.sendStatus(403);
//             }
//             if(payload.tokenType!='refreshToken'){
//                 console.log('You cannot generate new access token with access token');
//                 return res.status(403).json({
//                     message: 'You cannot generate new access token with access token'
//                 });
//             }
//             const accessToken=jwt.sign({name: payload.name, pw: payload.pw, id: payload.id},
//                 process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "30s"});
//             await addToken(accessToken, payload.id, res, now, 'accessToken');
//             const body=new RefreshTokenDTO('New access token generated', accessToken)
//             console.log('New access token generated', accessToken);
//             return res.status(200).json(body);
//         })
//     }catch (err){
//         console.log(err);
//         return res.status(401).json({
//             message: 'Something went wrong',
//             err: err
//         })
//     }
//
//
// }
// export async function deleteTokensByLogOut(accessToken: string, refreshToken:string){
//     try {
//         const deleteExpiredTokens = await prisma.tokens.deleteMany({
//             where: {
//                 token: accessToken,
//                 token_type: 'accessToken'
//             }
//         })
//
//         const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
//             where: {
//                 token: refreshToken,
//                 token_type: 'refreshToken'
//             }
//         })
//         console.log('Deleted accessToken(s):'+ deleteExpiredTokens.count +'Deleted refreshToken(s): '
//             + deleteExpiredRefreshTokens.count);
//
//
//     } catch (err) {
//         console.log('Something went wrong when deleting tokens:' + err)
//
//     }
// }

