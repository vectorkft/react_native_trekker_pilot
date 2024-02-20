import {Response, Request} from 'express';
import {loginDTO} from "../dto/loginDTO";
import {RefreshTokenDTO} from "../dto/refreshTokenDTO";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";
import {z} from "zod";
import {tokenDTO} from "../dto/tokenDTO";

const prisma = new PrismaClient()
const tokenSchema=z.object({
    refreshToken: z.string()

})

export async function addToken(token: string, userId: number, res : Response, currentTime: number,tokenType: string){
    try{
        await prisma.tokens.create({
            data: {
                token: token,
                user_id: userId,
                created_at: currentTime,
                token_type: tokenType
            },
        })

        console.log(tokenType+' added successfully: '+token);
    } catch (err) {
        console.log('Something went wrong: ' + err)
        return res.status(401).json({
            message: 'Something went wrong',
            err: err
        })
    }



}


export async function deleteExpiredTokens(){
    const fiveMinutesAgo = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
    const thirtySecondsAgo = Math.floor((Date.now() - 30 * 1000) / 1000);

    const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
    try {
        const deleteExpiredTokens = await prisma.tokens.deleteMany({
            where: {
                created_at: {
                    lt: thirtySecondsAgo
                },
                token_type: 'accessToken'
            }
        })
        const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
            where: {
                created_at: {
                    lt: oneDayAgo
                },
                token_type: 'refreshToken'
            }
        })
        console.log('Deleted accessToken(s): ' + deleteExpiredTokens.count + ' Deleted refreshToken(s): '
        + deleteExpiredRefreshTokens.count);
    } catch (err) {
        console.log('Something went wrong when deleting tokens:' + err)
    }

}

export function refreshToken(refreshToken : string , res: Response){
    try{
        const validateParam=tokenSchema.parse({refreshToken: refreshToken})
        const now = Math.floor(new Date().getTime() / 1000);
        const secretKey = process.env.JWT_SECRET_KEY ?? ''


        jwt.verify(refreshToken, secretKey, async (err: any, payload: any) => {
            if (err) {
                console.log('Invalid token ' + err);
                return res.sendStatus(403);
            }
            if(payload.tokenType!='refreshToken'){
                console.log('You cannot generate new access token with access token');
                return res.status(403).json({
                    message: 'You cannot generate new access token with access token'
                });
            }
            const accessToken=jwt.sign({name: payload.name, pw: payload.pw, id: payload.id},
                process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "30s"});
            await addToken(accessToken, payload.id, res, now, 'accessToken');
            const body=new RefreshTokenDTO('New access token generated', accessToken)
            console.log('New acces token generated', accessToken);
            return res.status(200).json(body);
        })
    }catch (err){
        console.log(err);
        return res.status(401).json({
            message: 'Something went wrong',
            err: err
        })
    }


}
export async function deleteTokensByLogOut(accessToken: string, refreshToken:string){
    try {
        const deleteExpiredTokens = await prisma.tokens.deleteMany({
            where: {
                token: accessToken,
                token_type: 'accessToken'
            }
        })

        const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
            where: {
                token: refreshToken,
                token_type: 'refreshToken'
            }
        })
        console.log('Deleted accessToken(s):'+ deleteExpiredTokens.count +'Deleted refreshToken(s): '
            + deleteExpiredRefreshTokens.count);


    } catch (err) {
        console.log('Something went wrong when deleting tokens:' + err)

    }
}

export function addTokenAtLogin(){

}

