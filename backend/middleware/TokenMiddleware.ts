import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import * as tokenService from "../services/tokenServices"


dotenv.config()
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    const secretKey=process.env.JWT_SECRET_KEY ?? ''
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // if(!await tokenService.isAccessTokenInDatabase({accessToken: token})){
        //     console.log('Invalid token');
        //     return res.sendStatus(403);
        // }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log('Invalid token :' + err);
                return res.sendStatus(403);
            }
            console.log('Valid token');


            next();
        });
    } else {
        res.sendStatus(403);
    }
}