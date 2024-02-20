
import express, {NextFunction, Request, Response} from 'express';
import * as userserv  from './services/userServices';
import * as cikkserv from './services/cikkService';
import bodyParser, {Options} from "body-parser";
import * as tokenserv from './services/tokenServices';
import * as cron from 'node-cron';
import {deleteExpiredTokens} from './services/tokenServices';
import {verifyToken} from "./middleware/TokenMiddleware";
import {Logger} from "./middleware/LogMiddleWare";





const app = express();
const HTTP_PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json(), Logger);

app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.get('/', (res: Response) => {

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

    await userserv.loginUser(req.body.name, req.body.pw, res);
    console.log(req.body)



})

app.post('/protected',verifyToken, (req,res) => {

    return res.status(200).json({ message: 'Protected route accessed' });
})


app.post('/refresh', (req : Request, res : Response) => {
    tokenserv.refreshToken(req.body.refreshToken,res)
})

app.post('/register', async (req: Request, res: Response) => {
    try {
        await userserv.registerUser(req.body.name, req.body.pw, res);
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }
});



app.post('/deleteUser', async(req: Request, res: Response) => {
    try{
        await userserv.deleteUser(req.body.id, res);
    } catch(err) {
        console.error(err);
        return res.status(500).send('An error occurred during deletion.');

    }

})

cron.schedule("* * * * *", deleteExpiredTokens);


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
       await cikkserv.getCikkByCikkszam(req.body.cikkszam,res);
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }
})

app.post('/getCikkByEAN',async (req: Request, res: Response)=>{
    try{
        await cikkserv.getCikkByEanKod(req.body.eankod , res);
    } catch (err){
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }

})

app.post('/profile',verifyToken ,async (req: Request, res: Response)=>{
    try{
        await userserv.getUserById(req.body.id,res);
    } catch (err){
        console.error(err);
        return res.status(500).send('Something went wrong: ' + err);
    }

})

app.post('/logout',verifyToken, async (req : Request, res : Response) =>{
    const authHeader = req.headers.authorization??'';
    const accesToken = authHeader.split(' ')[1];
    const refreshToken=req.body.refreshToken;
    try {
        await tokenserv.deleteTokensByLogOut(accesToken,refreshToken);
        return res.status(200).json('Sikeres kijelentkezes');
    }catch (err){
        console.error(err);
        return res.status(500).send('Something went wrong:'+ err);
    }
})