import { ZodDTO } from "../dto/zodDTO";
import {ZodError} from "zod";
import {PrismaClientInitializationError, PrismaClientRustPanicError} from "@prisma/client/runtime/library";
import {NextFunction, Request, Response} from 'express';
import {JsonWebTokenError} from "jsonwebtoken";

export function handleErrors(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if(err instanceof PrismaClientRustPanicError){
        return res.status(401).json({message: 'Invalid username or password'});
    }
    if(err instanceof PrismaClientInitializationError){
        return res.status(500).json({message: 'Cannot connect to the database'});
    }
    if(err instanceof ZodError){
        return res.status(400).json({error: ZodDTO.fromZodError(err)});
    }
    if(err instanceof JsonWebTokenError){
        return res.status(403).json(err);
    }

    return res.status(500).json({message: 'Unexpected error'});
}