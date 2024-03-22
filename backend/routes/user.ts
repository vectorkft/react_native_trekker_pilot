import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../../shared/services/zod";
import * as userService from "../services/user";
import * as tokenService from "../services/token";
import * as tokenServiceNew from "../services/servicesNew/tokenServiceNew";
import * as userServiceNew from "../services/servicesNew/userServiceNew"
import {UserLoginDTOInput} from "../../shared/dto/user-login";



// Public endpoints
const userRouter = express.Router();
// Protected endpoints
const protectedUserRouter = express.Router();
userRouter.post('/login', async (req: Request, res: Response, next : NextFunction) => {

    try {
        const validData= await zParse(UserLoginDTOInput,req.body);

        const body=await userService.loginUser(validData);

        return res.status(200).json(body);
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
            return res.status(200).json('Logout successful');
        }
    }catch (e) {
        next(e);
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