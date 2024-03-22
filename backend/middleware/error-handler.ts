import { ZodDTO } from "../dto/zodDTO";
import {ZodError} from "zod";
import {NextFunction, Request, Response} from 'express';


export function handleErrors(err: Error, _req: Request, res: Response, _next: NextFunction) {
    const statusMessageMapping: Record<string, {status: number, message: string}> = {
        PrismaClientRustPanicError: {status: 401, message: 'Invalid username or password'},
        PrismaClientInitializationError: {status: 500, message: 'Cannot connect to the database'},
        ZodError: {status: 400, message: ''},
        JsonWebTokenError: {status: 403, message: ''},
        MenuNotFound: {status: 404, message: ''},
        UserNotFound: {status: 401, message: ''},
        RefreshError: {status: 403, message: ''}
    };

    const statusMessage = statusMessageMapping[err.constructor.name];
    if (!statusMessage) { return res.status(500).json({message: 'Unexpected error'}); }

    if (err instanceof ZodError){
        return res.status(statusMessage.status).json({error: ZodDTO.fromZodError(err)});
    }

    return res.status(statusMessage.status).json({message: statusMessage.message || err.message});
}