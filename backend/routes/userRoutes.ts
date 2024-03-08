import express, {Request, Response} from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {userSchemaInput} from "../../shared/dto/user.dto";
import * as userserv from "../services/userServices";
import {ZodDTO} from "../dto/zodDTO";
import * as tokenserv from "../services/tokenServices";


const userRouter = express.Router();
// Védett végpontok
const protectedUserRouter = express.Router();
userRouter.post('/login', async (req: Request, res: Response) => {

    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userserv.loginUser(validData);
        if("errormessage" in body){
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    } catch (err: any) {
        return res.status(400).send(ZodDTO.fromZodError(err));
    }
});


userRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userserv.registerUser(validData);
        if('message' in body && body.message === 'Username already exists'/*body instanceof MessageDTO*/) {
            return res.status(409 ).json(body);
        }
        return res.status(200).json(body)
    } catch (err: any) {
        return res.status(400).send(ZodDTO.fromZodError(err));
    }
});


protectedUserRouter.get('/logout', async (req: Request, res : Response) =>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try {
        await tokenserv.deleteTokensByLogout_new({ accessToken: accessToken });
        return res.status(200).json('Logout successful');
    }catch (e) {
        return res.status(403).json('err' + e);
    }
});

protectedUserRouter.post('/profile',async (req: Request, res: Response)=>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{
        const body=await userserv.getUserById_new({accessToken: accessToken});
        if(!body){
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body)
    } catch (err){
        console.error(err);
        return res.status(400).send('Something went wrong: ' + err);
    }

});

export { userRouter, protectedUserRouter };