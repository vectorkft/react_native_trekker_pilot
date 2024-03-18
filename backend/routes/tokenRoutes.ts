import express, {Request, Response} from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {ZodDTO} from "../dto/zodDTO";
import * as tokenService from "../services/tokenServices";
import {RefreshBodySchemaInput} from "../../shared/dto/refresh.token.dto";

import * as tokenServiceNew from "../services/servicesNew/tokenServiceNew"


export const tokenRouter = express.Router();


tokenRouter.post('/refresh', async (req : Request, res : Response) => {
    try {
        const validData = await zParse(RefreshBodySchemaInput, req.body);
        const body = await tokenService.refreshToken({ refreshToken: validData.refreshToken });
        if('errorMessage' in body){
            //Ha van errorMessage akkor rossz a token amit kaptunk
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    } catch (e) {
        //ha zodError van
        return res.status(400).json(ZodDTO.fromZodError(e));

    }
});
//// FOR TESTING PURPOSE ONLY
tokenRouter.post('/refreshTeszt', async (req:Request, res : Response)=>{
    try {
        const validData = await zParse(RefreshBodySchemaInput, req.body);
        const body = await tokenServiceNew.refreshToken_new({ refreshToken: validData.refreshToken });
        if('errorMessage' in body){
            //Ha van errorMessage akkor rossz a token amit kaptunk
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    } catch (e) {
        //ha zodError van
        return res.status(400).json(e);

    }
})