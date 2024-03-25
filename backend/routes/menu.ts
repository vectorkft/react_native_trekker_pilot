import express, {NextFunction, Request, Response} from "express";
import * as menuService from "../services/menu"
import {zParse} from "../../shared/services/zod";
import {MenuInput} from "../../shared/dto/menu";
import {HTTP_STATUS_OK} from "../constants/http-status-codes";

export const menuRouter=express.Router();

menuRouter.post('/menu', async(req: Request, res: Response, next : NextFunction)=>{
    try{
        const validData= await zParse(MenuInput,req.body);

        const body=await menuService.getMenuElement(validData);

        return res.status(HTTP_STATUS_OK).json(body);

    }catch (e) {
        next(e);
    }

})