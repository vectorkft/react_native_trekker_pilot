import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import * as tokenService from "../services/token"
import {PrismaClientInitializationError} from "@prisma/client/runtime/library";
import Chalk from "chalk";
import {HTTP_STATUS_FORBIDDEN, HTTP_STATUS_INTERNAL_SERVER_ERROR} from "../constants/http-status-codes";


dotenv.config()
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    const secretKey=process.env.JWT_SECRET_KEY ?? ''
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try{
            if(!await tokenService.isAccessTokenInDatabase({accessToken: token})){
                console.log(Chalk.redBright('Invalid token'));
                return res.sendStatus(HTTP_STATUS_FORBIDDEN);
            }
        }catch(err){
            if(err instanceof PrismaClientInitializationError){
                return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json('Cannot connect to the database');
            }

        }


        jwt.verify(token, secretKey, (err) => {
            if (err) {
                console.log(Chalk.redBright('Invalid token :' + err));
                return res.sendStatus(HTTP_STATUS_FORBIDDEN);
            }
            console.log(Chalk.greenBright('Valid token'));


            next();
        });
    } else {
        res.sendStatus(HTTP_STATUS_FORBIDDEN);
    }
}