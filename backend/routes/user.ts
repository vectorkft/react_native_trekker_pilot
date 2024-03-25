import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../../shared/services/zod";
import * as userService from "../services/user";
import * as tokenService from "../services/token";
import {UserLoginDTOInput} from "../../shared/dto/user-login";
import {HTTP_STATUS_OK} from "../constants/http-status-codes";


// Public endpoints
const userRouter = express.Router();
// Protected endpoints
const protectedUserRouter = express.Router();
userRouter.post('/login', async (req: Request, res: Response, next : NextFunction) => {

    try {
        const validData= await zParse(UserLoginDTOInput,req.body);

        const body=await userService.loginUser(validData);

        return res.status(HTTP_STATUS_OK).json(body);
    } catch (err) {
        next(err);
    }
});

protectedUserRouter.get('/logout', async (req: Request, res : Response, next : NextFunction) =>{

    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try {
        const isSuccess=await tokenService.deleteTokensByLogout({ accessToken: accessToken });
        if(isSuccess){
            return res.status(HTTP_STATUS_OK).json('Logout successful');
        }
    }catch (e) {
        next(e);
    }
});

protectedUserRouter.post('/profile',async (_req: Request, res: Response)=>{
    return res.status(HTTP_STATUS_OK).json('OK');


});

export { userRouter, protectedUserRouter };