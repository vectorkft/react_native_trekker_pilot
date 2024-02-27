import * as tokenService from './tokenServices';
import {deleteTokensByLogout_new} from './tokenServices';
import jwt from "jsonwebtoken";
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';

import {ProfileDTO} from "../dto/profileDTO";
import {JwtPayload} from "../models/JwtPayload";
import {MessageDTO} from "../dto/messageDTO";
import {
    userAlreadyExistDTOOutput,
    userLoginDTOOutput,
    userRegisterDTOOutput, ZuserAlreadyExistsDTOOutput,
    ZuserLoginDTOOutput,
    ZuserRegisterDTOOutput
} from "../../shared/dto/user.dto";
import {zParse} from "../../shared/services/zod-dto.service";



dotenv.config()
const prisma = new PrismaClient()


export async function loginUser(name: string, password: string) {

    try {
        // UserSchema.parse({name: name, pw: password});
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
            await tokenService.addTokenAtLogin(token,refreshToken,userId);
            const body: ZuserLoginDTOOutput= await zParse(userLoginDTOOutput,{message:'Login Success, token added successfully', accessToken:token,
            refreshToken:refreshToken,userId:userId, currentTime:now});
            return body;
            //return new loginDTO('Login Success, token added successfully', token, refreshToken, userId, now);
        }
        else {
            console.log('Wrong username or password');
            return "Wrong username or password";
        }




    } catch (err) {
        console.log('Invalid parameters ' + err)
        throw err;
    }
}

export async function registerUser(name: string, password: string) {
    try{
        const existed =await prisma.user.findFirst({
            where: {
                name: name,
            }
        })
        if(existed){
            const body : ZuserAlreadyExistsDTOOutput=await zParse(userAlreadyExistDTOOutput,{message:'Username already exists',name:name});
            //return new MessageDTO('Username already exists');
            return body;
        }
            await prisma.user.create({
                data: {
                    name: name,
                    pw: password,
                },
            })
        const body:ZuserRegisterDTOOutput=await zParse(userRegisterDTOOutput,{message:'User registration successful',username:name,password:password});
        return body;
        //return new registerDTO('User registration successful', name, password)

    } catch (err : any) {
        console.log('Invalid parameters'+ err)
        throw err;
    }

}


export async function getUserById_new(accessToken:string){
    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    try{
        const user= await prisma.user.findFirst({
            where:{id: decodedAccessToken.id}
        })
        if(!user){
            return false;
        }
        return new ProfileDTO(user.name??'');
    } catch (err){
        console.log(err);
    }
}

export async function deleteUserByIdFromToken(accessToken:string){
    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    try{
        const user= await prisma.user.delete({
            where:{id: decodedAccessToken.id}
        })
        if(!user){
            return false;
        }
        await deleteTokensByLogout_new(accessToken);
        return new MessageDTO('Account has been deleted successfully');
    } catch (err){
        console.log(err);
    }


}








