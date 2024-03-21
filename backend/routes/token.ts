import express, {Request, Response} from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {ZodDTO} from "../dto/zodDTO";
import * as tokenService from "../services/token";

import * as tokenServiceNew from "../services/servicesNew/tokenServiceNew"
import {PrismaClientInitializationError} from '@prisma/client/runtime/library';
import {TokenDTOInput} from "../../shared/dto/token.dto";
import {JsonWebTokenError} from "jsonwebtoken";




export const tokenRouter = express.Router();


tokenRouter.post('/refresh', async (req : Request, res : Response) => {
    try {
        const validData = await zParse(TokenDTOInput, req.body);
        const body = await tokenService.refreshToken({ refreshToken: validData.refreshToken });
        if('errorMessage' in body){
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    } catch (e) {
        if(e instanceof PrismaClientInitializationError){
            return res.status(500).json('Cannot connect to the database');
        }
        if(e instanceof JsonWebTokenError){
            return res.status(403).json(e);
        }
        return res.status(400).json(ZodDTO.fromZodError(e));

    }
});
//// FOR TESTING PURPOSE ONLY
tokenRouter.post('/refreshTeszt', async (req:Request, res : Response)=>{
    try {
        const validData = await zParse(TokenDTOInput, req.body);
        const body = await tokenServiceNew.refreshToken_new({ refreshToken: validData.refreshToken });
        if('errorMessage' in body){
            //Ha van errorMessage akkor rossz a token amit kaptunk
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    } catch (e) {

        return res.status(400).json(e);

    }
})