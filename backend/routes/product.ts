import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../../shared/services/zod";
import {
    ProductEANSchemaInput, ProductGeneralSchema,
    ProductNumberSchemaInput,
} from "../../shared/dto/product";
import * as cikkService from "../services/product";
import {HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK} from "../constants/http-status-codes";



export const protectedProductRouter = express.Router();

protectedProductRouter.post('/getCikkByEAN', async (req: Request, res: Response, next : NextFunction)=>{
    try{

        const validData=await zParse(ProductEANSchemaInput,req.body);
        const body= await cikkService.getCikkByEanKod(validData);
        if(!body){
            return res.status(HTTP_STATUS_NO_CONTENT).json(body);

        }
        return res.status(HTTP_STATUS_OK).json(body);

    } catch (err){
        next(err);
    }

})

protectedProductRouter.post('/getCikk', async (req: Request, res: Response, next : NextFunction)=>{
    try{
        const body = req.body;
        const validData  = await zParse(ProductGeneralSchema,body);
        const result= await cikkService.getCikkHelper(validData);
        if(!result) {
            return res.status(HTTP_STATUS_NO_CONTENT).json(result);
        }
        return res.status(HTTP_STATUS_OK).json(result);
    } catch (e){
        next(e);
    }
})
protectedProductRouter.post('/getCikkByETK', async (req: Request, res : Response, next : NextFunction)=>{
    try{
        const validData = await zParse(ProductNumberSchemaInput,req.body);

        const body= await cikkService.getCikkByCikkszam(validData);
        if(!body){
            return res.status(HTTP_STATUS_NO_CONTENT).json(body);
        }
        return res.status(HTTP_STATUS_OK).json(body);
    } catch (err){
        next(err);
    }
})

