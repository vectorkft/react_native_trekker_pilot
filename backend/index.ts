import express, {Request,Response} from 'express';
import * as cron from 'node-cron';
import {deleteExpiredTokens_new} from './services/token';
import {verifyToken} from "./middleware/token-validator";
import {Logger} from "./middleware/log-to-console";
import {userRouter, protectedUserRouter} from './routes/user';
import {tokenRouter} from "./routes/token";
import {protectedProductRouter} from "./routes/product";
import {handleErrors} from "./middleware/error-handler";
import {menuRouter} from "./routes/menu";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {options} from "./swagger/options";
import {HTTP_STATUS_OK} from "./constants/http-status-codes";


const app = express();
const HTTP_PORT = 8000;

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

// Body parsing middleware
app.use(express.json(), Logger);
app.use(express.urlencoded({ extended: false }));

// Public endpoints
app.use('/user', userRouter);
app.use('/token', tokenRouter);

// Protected endpoints
app.use('/protected/user',verifyToken, protectedUserRouter);
app.use('/protected/product',verifyToken, protectedProductRouter);
app.use('/protected/',verifyToken,menuRouter);

app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.get('/', (_req: Request, res: Response) => {
    return res.status(HTTP_STATUS_OK).json('Check postman for guidance');
});
app.use(handleErrors);
cron.schedule(" * * * * *", deleteExpiredTokens_new);

// Státusz ellenőrzések, nem fontos

app.get('/check', async (_req: Request,res: Response) => {
    return res.status(HTTP_STATUS_OK).json('API is running');
})

