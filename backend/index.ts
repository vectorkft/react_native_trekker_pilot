
import express, {Request, Response} from 'express';
import * as userserv  from './services/userServices';
import * as cikkserv from './services/cikkService';
import bodyParser from "body-parser";
import * as tokenserv from './services/tokenServices';
import * as cron from 'node-cron';
import {deleteExpiredTokens_new} from './services/tokenServices';
import {verifyToken} from "./middleware/TokenMiddleware";
import {Logger} from "./middleware/LogMiddleWare";
import {ZodDTO} from "./dto/zodDTO";
import {CikkNotFoundDTO} from "./dto/cikkNotFoundDTO";
import {cikkEANSchemaInput, cikkSzamSchemaInput} from "../shared/dto/article.dto";
import {zParse} from "../shared/services/zod-dto.service"
import {RefreshBodySchemaInput} from "../shared/dto/refresh.token.dto";
import {MessageDTO} from "./dto/messageDTO";
import {userSchemaInput} from "../shared/dto/user.dto";



const app = express();
const HTTP_PORT = 8000;
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};


app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json(), Logger);

app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.get('/', ( req: Request, res: Response,) => {
    const data = {
        vegpont: '/login',
        amitker: {
            name: "sanyi",
            pw : "asd"
        },
        amivisszaad: {
            message: "Login Succes, token added succesfully",
            accesToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGVnam9iYm5ldjIiLCJwdyI6ImxlZ2pvYmJqZWxzem9pcyIsImlhdCI6MTcwODMzNTY3MCwiZXhwIjoxNzA4MzM1OTcwfQ.qmlxF317wdVir6R7TZLbJRXsJhCsk7dnZ9idM9rWKvw",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGVnam9iYm5ldjIiLCJwdyI6ImxlZ2pvYmJqZWxzem9pcyIsImlkIjoyNCwiaWF0IjoxNzA4MzM1NjcwLCJleHAiOjE3MDg0MjIwNzB9.NxpGpI0RRW43QmAwAuNoOqrQNXQcZrLzne8UpEUaobc",
            userId: 24,
            currentTime: 1708335670
        },

    };

    return res.status(400).send('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
});

app.post('/login', async (req: Request, res: Response) => {

    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userserv.loginUser(validData.name,validData.pw);
        if(body==='Wrong username or password'){
            return res.status(401).json(body);
        }
        if(body==='Username not found'){
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    } catch (err: any) {
        return res.status(400).send(ZodDTO.fromZodError(err));
    }



})

app.post('/protected',verifyToken, (req,res) => {

    return res.status(200).json({ message: 'Protected route accessed' });
})



app.post('/register', async (req: Request, res: Response) => {
    try {
        const validData= await zParse(userSchemaInput,req.body);
        const body=await userserv.registerUser(validData.name, validData.pw);
        if('message' in body && body.message === 'Username already exists'/*body instanceof MessageDTO*/) {
            return res.status(409 ).json(body);
        }
        return res.status(200).json(body)
    } catch (err: any) {
        return res.status(400).send(ZodDTO.fromZodError(err));
    }
});




cron.schedule("* * * * *", deleteExpiredTokens_new);


// Státusz ellenőrzések, nem fontos
app.get('/version', (res: Response) => {
    return res.status(200).json({
        message: '1'
    })
})
app.all('/check', (res: Response) => {
    return res.status(200).json({
        message: 'Server is running'
    })
})

app.post('/getCikk', async (req: Request, res: Response)=>{
    try{
        const validData = await zParse(cikkSzamSchemaInput,req.body);
        const body= await cikkserv.getCikkByCikkszam(validData.cikkszam);
        if(body==="Not found"){
           return res.status(404).json({message:'Not found'})
        }
        return res.status(200).json(body);
    } catch (err){
        console.error(err);
        return res.status(400).json(ZodDTO.fromZodError(err));
    }
})

app.post('/getCikkByEAN',verifyToken ,async (req: Request, res: Response)=>{
    try{
        const validData=await zParse(cikkEANSchemaInput,req.body);
        const body= await cikkserv.getCikkByEanKod2(validData.eankod);
        if(body instanceof CikkNotFoundDTO){
            return res.status(204).json(body);

        }
        return res.status(200).json(body);

    } catch (err){
        console.error(err);
        return res.status(400).json(ZodDTO.fromZodError(err));
    }

})


app.post('/refresh', async (req : Request, res : Response) => {
    try {
        const validData= await zParse(RefreshBodySchemaInput,req.body);
        const body = await tokenserv.refreshToken_new(validData.refreshToken);
        if(body instanceof MessageDTO){
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    } catch (e) {
        return res.status(403).json(ZodDTO.fromZodError(e));
    }
})

app.get('/logout',verifyToken, async (req: Request, res : Response) =>{
    const authHeader = req.headers.authorization??'';
    const accesToken = authHeader.split(' ')[1];
    try {
        await tokenserv.deleteTokensByLogout_new(accesToken);
        return res.status(200).json('Logout successful');
    }catch (e) {
        return res.status(403).json('err' + e);
    }
})

app.post('/profile',verifyToken,async (req: Request, res: Response)=>{
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{
        const body=await userserv.getUserById_new(accessToken);
        if(!body){
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body)
    } catch (err){
        console.error(err);
        return res.status(404).send('Something went wrong: ' + err);
    }

})

app.post('/deleteUser',verifyToken, async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization??'';
    const accessToken = authHeader.split(' ')[1];
    try{
        const body=await userserv.deleteUserByIdFromToken(accessToken);
        if(!body){
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body)
    } catch (err){
        console.error(err);
        return res.status(404).send('Something went wrong: ' + err);
    }

})
//új dolgok tesztelésére van
// app.post('/login2', async (req: Request, res: Response) => {
//
// })
