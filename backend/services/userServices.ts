
import e, {Response} from 'express';
import * as tokenService  from './tokenServices';
import jwt from "jsonwebtoken";
import {z} from 'zod'
import {registerDTO} from "../dto/registerDTO";
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
import {loginDTO} from "../dto/loginDTO";




dotenv.config()
const prisma = new PrismaClient()
const UserSchema = z.object({
    name: z.string().min(6, { message: "Username must be 6 or more characters long" }),
    pw: z.string().min(6, { message: "Password must be 6 or more characters long" }),
});

//Read all users

export async function readAll(res:Response) {
    const allUsers =await prisma.tokens.findMany();

    console.log('users: ' + allUsers)
    return res.status(200).json({
        users: allUsers
    })
}
export async function loginUser(name: string, password: string, res : Response) {

    try {
        const validatedParams = UserSchema.parse({name: name, pw: password});
        const user=await prisma.user.findFirst({
            where:{ name : name, pw: password}

        })
        if(user){
            const userId=user.id
            const now = Math.floor(new Date().getTime() / 1000);
            const token = jwt.sign({name: name, pw: password,id: userId, tokenType: 'accessToken'},
                process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "30s"});
            const refreshToken=jwt.sign({name: name, pw: password, id: userId, tokenType:'refreshToken'},
                process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "1d"});
            console.log('Sikeres bejelentkezes ' + name);
            await tokenService.addToken(refreshToken, userId,res, now, 'refreshToken');
            await tokenService.addToken(token, userId,res, now, 'accessToken');
            const body = new loginDTO('Login Succes, token added succesfully', token,refreshToken, userId,now)
            return res.status(200).json(body)
        }
        else {
            console.log('Hibás felhasználónév vagy jelszó');
            return res.status(401).json({
                message: 'Hibás felhasználónév vagy jelszó'
            })
        }




    } catch (err) {
        console.log('Invalid parameters ' + err)
        res.status(401).json({
            message: 'Invalid parameters',
            err: err
        })
    }
}

export async function registerUser(name: string, password: string, res : Response) {
    try{
        const validatedParams = UserSchema.parse({name: name, pw: password});
            await prisma.user.create({
                data: {
                    name: name,
                    pw: password,
                },
            })
            const body : registerDTO  = new registerDTO('User registration successful', name,password);
            res.status(200).json(body);

    } catch (err){
        console.log('Invalid parameters'+ err)
        res.status(401).json({
            message: 'Invalid parameters',
            err: err
        })
    }

}

export async function deleteUser(id: number, res :Response){
    try {
        const delUser=await prisma.user.delete({where: {
                id: id
            }})
        console.log('User deleted');
        return res.status(200).json({
            message: 'User deleted'
        })
    }
    catch (err)
    {
        console.log('Something went wrong when deleting a user')
        return res.status(404).json({
            message: 'User deleting went wrong',
            err: err
        })
    }
}

export async function getUserById(id:number,res:Response){
    try{
        const user= await prisma.user.findFirst({
            where:{id: id}
        })
        if(!user){
            return res.status(404).json('A kért felhasználó nem található');
        }
        return res.status(200).json(user);
    } catch (err){
        console.log(err);
    }
}








