import express, {Request, Response} from 'express';
import * as cron from 'node-cron';
import {deleteExpiredTokens, deleteExpiredTokens_new} from './services/tokenServices';
import {verifyToken} from "./middleware/TokenMiddleware";
import {Logger} from "./middleware/LogMiddleWare";
import {userRouter, protectedUserRouter} from './routes/userRoutes';
import {tokenRouter} from "./routes/tokenRoutes";
import {protectedProductRouter} from "./routes/productRoutes";

const app = express();
const HTTP_PORT = 8000;


// Body parsing middleware
app.use(express.json(), Logger);
app.use(express.urlencoded({ extended: false }));

// Public endpoints
app.use('/user', userRouter);
app.use('/token', tokenRouter);

// Protected endpoints
app.use('/protected/user',verifyToken, protectedUserRouter);
app.use('/protected/product',verifyToken, protectedProductRouter);

app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.get('/', ( req: Request, res: Response,) => {
    return res.status(200).json('Check postman for guidance');
});

cron.schedule("* * * * *", deleteExpiredTokens);
cron.schedule("* * * * *", deleteExpiredTokens_new);

// Státusz ellenőrzések, nem fontos

app.all('/check', (res: Response) => {
    return res.status(200).json({
        message: 'Server is running'
    })
})

