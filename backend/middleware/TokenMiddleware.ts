import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import * as tokenService from "../services/token"
import {PrismaClientInitializationError} from "@prisma/client/runtime/library";
import Chalk from "chalk";


dotenv.config()
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    const secretKey=process.env.JWT_SECRET_KEY ?? ''
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try{
            if(!await tokenService.isAccessTokenInDatabase({accessToken: token})){
                console.log(Chalk.red('Invalid token'));
                return res.sendStatus(403);
            }
        }catch(err){
            if(err instanceof PrismaClientInitializationError){
                return res.status(500).json('Cannot connect to the database');
            }

        }


        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log(Chalk.red('Invalid token :' + err));
                return res.sendStatus(403);
            }
            console.log(Chalk.green('Valid token'));


            next();
        });
    } else {
        res.sendStatus(403);
    }
}