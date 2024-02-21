
import express, {Request, Response} from 'express';
import * as userserv  from './services/userServices';
import * as cikkserv from './services/cikkService';
import bodyParser from "body-parser";
import * as tokenserv from './services/tokenServices';
import * as cron from 'node-cron';
import {deleteExpiredTokens_new} from './services/tokenServices';
import {verifyToken} from "./middleware/TokenMiddleware";
import {Logger} from "./middleware/LogMiddleWare";
import { fromZodError } from 'zod-validation-error';
import {ZodDTO} from "./dto/zodDTO";




const app = express();
const HTTP_PORT = 8000;

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
        const body=await userserv.loginUser(req.body.name, req.body.pw);
        if(body==='Wrong username or password'){
            return res.status(401).json(body)
        }
        return res.status(200).json(body)
    } catch (err: any) {
        return res.status(400).send(fromZodError(err).toString());
    }



})

app.post('/protected',verifyToken, (req,res) => {

    return res.status(200).json({ message: 'Protected route accessed' });
})



app.post('/register', async (req: Request, res: Response) => {
    try {
        const body=await userserv.registerUser(req.body.name, req.body.pw);
        return res.status(200).json(body)
    } catch (err: any) {
        return res.status(400).send(err);
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
        const body= await cikkserv.getCikkByCikkszam(req.body.cikkszam);
        if(body==="Not found"){
           return res.status(404).json({message:'Not found'})
        }
        return res.status(200).json(body);
    } catch (err){
        console.error(err);
        return res.status(400).json(err);
    }
})

app.post('/getCikkByEAN',async (req: Request, res: Response)=>{
    try{
       const body= await cikkserv.getCikkByEanKod(req.body.eankod);
        if(body==="Not found"){
            return res.status(404).json({message:'Not found'})
        }
       return res.status(200).json(body);
    } catch (err:any){
        console.error(err);
        return res.status(400).json(fromZodError(err).toString());
    }

})


app.post('/refresh', async (req : Request, res : Response) => {
    try {
        const body = await tokenserv.refreshToken_new(req.body.refreshToken);
        return res.status(200).json(body);
    } catch (e) {
        return res.status(403).json(e);
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

app.post('/login2', async (req: Request, res: Response) => {

    try {
        const body=await userserv.loginUser(req.body.name, req.body.pw);
        if(body==='Wrong username or password'){
            return res.status(401).json(body)
        }
        return res.status(200).json(body);
    } catch (err: any) {
        if (err.issues && err.issues.length > 0) {
            const issues = err.issues.map((issue: any) => ({
                code: issue.code,
                expected: issue.expected,
                received: issue.received,
                path: issue.path.join('.')
            }));
            return res.status(400).json(issues);
        } else {
            console.error(err);
            return res.status(500).send('An unexpected error occurred');
        }
    }



})