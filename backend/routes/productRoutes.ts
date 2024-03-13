import express, { Request, Response } from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {ProductEANSchemaInput, ProductNumberSchemaInput} from "../../shared/dto/product.dto";
import * as cikkService from "../services/cikkService";
import {ZodDTO} from "../dto/zodDTO";
export const protectedProductRouter = express.Router();

protectedProductRouter.post('/getCikkByEAN',async (req: Request, res: Response)=>{
    try{

        const validData=await zParse(ProductEANSchemaInput,req.body);
        const body= await cikkService.getCikkByEanKod(validData);
        if(!body){
            return res.status(204).json(body);

        }
        return res.status(200).json(body);

    } catch (err){
        console.error(err);
        return res.status(400).json(ZodDTO.fromZodError(err));
    }

})

protectedProductRouter.post('/getCikk', async (req: Request, res: Response)=>{
    try{
        const validData = await zParse(ProductNumberSchemaInput,req.body);
        const body= await cikkService.getCikkByCikkszam(validData);
        if(body==="Not found"){
            return res.status(204).json({message: 'Not found'});
        }
        return res.status(200).json(body);
    } catch (err){
        return res.status(400).json(ZodDTO.fromZodError(err));
    }
})
