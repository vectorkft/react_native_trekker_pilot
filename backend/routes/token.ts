import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../../shared/services/zod";
import * as tokenService from "../services/token";
import {TokenDTOInput} from "../../shared/dto/token";
import {HTTP_STATUS_OK} from "../constants/http-status-codes";

export const tokenRouter = express.Router();


tokenRouter.post('/refresh', async (req : Request, res : Response, next : NextFunction) => {
    try {
        const validData = await zParse(TokenDTOInput, req.body);
        const body = await tokenService.refreshToken({ refreshToken: validData.refreshToken });
        return res.status(HTTP_STATUS_OK).json(body);
    } catch (e) {
        next(e);
    }
});
