import express, { Request, Response } from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {cikkEANSchemaInput, cikkSzamSchemaInput} from "../../shared/dto/article.dto";
import * as cikkserv from "../services/cikkService";
import {ZodDTO} from "../dto/zodDTO";
export const protectedProductRouter = express.Router();

protectedProductRouter.post('/getCikkByEAN',async (req: Request, res: Response)=>{
    try{

        const validData=await zParse(cikkEANSchemaInput,req.body);
        const body= await cikkserv.getCikkByEanKod(validData);
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
        const validData = await zParse(cikkSzamSchemaInput,req.body);
        const body= await cikkserv.getCikkByCikkszam(validData);
        if(body==="Not found"){
            return res.status(204).json({message: 'Not found'});
        }
        return res.status(200).json(body);
    } catch (err){
        return res.status(400).json(ZodDTO.fromZodError(err));
    }
})
