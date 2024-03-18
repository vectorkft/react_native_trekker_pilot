import express, {Request, Response} from 'express';
import {zParse} from "../../shared/services/zod-dto.service";
import {userSchemaInput} from "../../shared/dto/user.dto";
import * as userService from "../services/userServices";
import {ZodDTO} from "../dto/zodDTO";
import * as tokenService from "../services/tokenServices";
// TESTING
import * as tokenServiceNew from "../services/servicesNew/tokenServiceNew";
import * as userServiceNew from "../services/servicesNew/userServiceNew"
// TESTING

// Public endpoints
const userRouter = express.Router();
// Protected endpoints
const protectedUserRouter = express.Router();
userRouter.post('/login', async (req: Request, res: Response) => {

    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userService.loginUser(validData);
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
        const body=await userService.registerUser(validData);
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
        await tokenService.deleteTokensByLogout({ accessToken: accessToken });
        return res.status(200).json('Logout successful');
    }catch (e) {
        return res.status(403).json('err' + e);
    }
});

protectedUserRouter.post('/profile',async (req: Request, res: Response)=>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{
        const body=await userService.getUserById_new({accessToken: accessToken});
        if(!body){
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body)
    } catch (err){
        console.error(err);
        return res.status(400).send('Something went wrong: ' + err);
    }

});
//// FOR TESTING PURPOSE ONLY
userRouter.post('/teszt', async(req: Request, res : Response) => {
    try{
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userServiceNew.loginWithDB(validData);
        if('errormessage' in body){
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