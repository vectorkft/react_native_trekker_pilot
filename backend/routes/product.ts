import express, { Request, Response } from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {
    ProductEANSchemaInput,
    ProductNumberSchemaInput,
} from "../../shared/dto/product.dto";
import * as cikkService from "../services/product";
import {ZodDTO} from "../dto/zodDTO";

import * as cikkServiceNew from "../services/servicesNew/cikkServiceNew"
import {PrismaClientRustPanicError} from "@prisma/client/runtime/library";
import {ValidTypes} from "../../shared/enums/types";


export const protectedProductRouter = express.Router();

protectedProductRouter.post('/getCikkByEAN', async (req: Request, res: Response)=>{
    try{

        const validData=await zParse(ProductEANSchemaInput,req.body);
        const body= await cikkService.getCikkByEanKod(validData);
        if(!body){
            return res.status(204).json(body);

        }
        return res.status(200).json(body);

    } catch (err){
        console.error(err);
        return res.status(400).json(err);
    }

})

protectedProductRouter.post('/getCikk', async (req: Request, res: Response)=>{
     const body = req.body;
     if(body.validType===ValidTypes.both || body.validType=== ValidTypes.ean){
         const validData=await zParse(ProductEANSchemaInput,body);
         const result = await cikkService.getCikkByEanKod(validData);
         if(!result){
             return res.status(204).json(body);
         }
         return res.status(200).json(result);

     }else if (body.validType === ValidTypes.etk){
         const validData= await zParse(ProductNumberSchemaInput,body);
         const result = await cikkService.getCikkByCikkszam(validData);
         if(!result){
             return res.status(204).json(body);
         }
         return res.status(200).json(result);


     }
     return res.status(200).json('Under construction');
})
protectedProductRouter.post('/getCikkByETK', async (req: Request, res)=>{
    try{
        const validData = await zParse(ProductNumberSchemaInput,req.body);

        const body= await cikkService.getCikkByCikkszam(validData);
        if(!body){
            return res.status(204).json(body);
        }
        return res.status(200).json(body);
    } catch (err){
        return res.status(400).json(ZodDTO.fromZodError(err));
    }
})
//// TESTING
protectedProductRouter.post('/getCikkTeszt', async(req:Request, res:Response)=>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{
        const validData = await zParse(ProductNumberSchemaInput,req.body);
        const body= await cikkServiceNew.getCikkByCikkszam(validData,{accessToken: accessToken});
        if(body==="Not found"){
            return res.status(204).json({message: 'Not found'});
        }
        return res.status(200).json(body);
    } catch (err){
        if(err instanceof PrismaClientRustPanicError){
            return res.status(401).json('Invalid username or password');
        }
        return res.status(400).json(ZodDTO.fromZodError(err));
    }
})

protectedProductRouter.post('/getCikkByEANTeszt', async (req: Request, res: Response)=>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{

        const validData=await zParse(ProductEANSchemaInput,req.body);
        const body= await cikkServiceNew.getCikkByEanKod(validData,{accessToken: accessToken});
        if(!body){
            return res.status(204).json(body);

        }
        return res.status(200).json(body);

    } catch (err){
        if(err instanceof PrismaClientRustPanicError){
            return res.status(401).json('Invalid username or password');
        }
        return res.status(400).json(ZodDTO.fromZodError(err));
    }

})
