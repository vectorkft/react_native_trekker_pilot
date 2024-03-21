import express, {Request, Response} from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import * as userService from "../services/user";
import {ZodDTO} from "../dto/zodDTO";
import * as tokenService from "../services/token";

import * as tokenServiceNew from "../services/servicesNew/tokenServiceNew";
import * as userServiceNew from "../services/servicesNew/userServiceNew"
import {PrismaClientInitializationError,PrismaClientRustPanicError} from "@prisma/client/runtime/library";
import {UserLoginDTOInput, userSchemaInput} from "../../shared/dto/user-login.dto";
import {ZodError} from "zod";
import {UserLoginDTOInputASD} from "../dto/teszt-dto";


// Public endpoints
const userRouter = express.Router();
// Protected endpoints
const protectedUserRouter = express.Router();
userRouter.post('/login', async (req: Request, res: Response) => {

    try {
        //const validData= await zParse(UserLoginDTOInput,req.body);
        const validData_new = UserLoginDTOInputASD.parse(req.body);
        const body=await userService.loginUser(validData_new);
        if("errorMessage" in body){
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    } catch (err) {
        if(err instanceof PrismaClientRustPanicError){
            return res.status(401).json('Invalid username or password');
        }
        if(err instanceof PrismaClientInitializationError){
            return res.status(500).json('Cannot connect to the database');
        }
        if(err instanceof ZodError){
            return res.status(400).json(ZodDTO.fromZodError(err));
        }

        return res.status(500).json('Unexpected error');



    }
});


userRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userService.registerUser(validData);
        if("errorMessage" in body) {
            return res.status(409 ).json(body);
        }
        return res.status(200).json(body)
    } catch (err) {
        if(err instanceof PrismaClientInitializationError){
            return res.status(500).json('Cannot connect to the database');
        }
        return res.status(400).send(ZodDTO.fromZodError(err));
    }
});


protectedUserRouter.get('/logout', async (req: Request, res : Response) =>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try {
        const isSuccess=await tokenService.deleteTokensByLogout({ accessToken: accessToken });
        if(isSuccess){
            return res.status(200).json('Logout successful');
        }

    }catch (e) {
        return res.status(403).json(e);
    }
});

protectedUserRouter.post('/profile',async (_req: Request, res: Response)=>{
    return res.status(200).json('OK');


});
//// FOR TESTING PURPOSE ONLY
userRouter.post('/teszt', async(req: Request, res : Response) => {
    try{
        const validData= await zParse(UserLoginDTOInput,req.body);
        const body=await userServiceNew.loginWithDB(validData);
        if('errorMessage' in body){
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    } catch (err){
        console.log(err)
        return res.status(400).json(err);
    }

});
protectedUserRouter.get('/logoutteszt',async(req: Request, res : Response) =>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try {
        await tokenServiceNew.deleteTokensByLogout_new({ accessToken: accessToken });
        return res.status(200).json('Logout successful');
    }catch (e) {
        return res.status(403).json('err' + e);
    }
})
export { userRouter, protectedUserRouter };