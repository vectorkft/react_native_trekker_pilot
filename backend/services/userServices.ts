import * as tokenService from './tokenServices';
import {deleteTokensByLogout_new} from './tokenServices';
import jwt from "jsonwebtoken";
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';
import {JwtPayload} from "../models/JwtPayload";
import {
    userAlreadyExistDTOOutput,
    userDeletedOutPut,
    userDeletedOutPutError,
    userLoginDTOOutput,
    userLoginFailedOutput,
    userRegisterDTOOutput,
    ZUserSchemaInput
} from "../../shared/dto/user.dto";
import {zParse} from "../../shared/services/zod-dto.service";
import {ZAccessTokenInput} from "../../shared/dto/refresh.token.dto";


dotenv.config()
const prisma = new PrismaClient()


export async function loginUser(userInput: ZUserSchemaInput) {
    const user= await prisma.pilot_user.findFirst({
        where:{ name: userInput.name, pw: userInput.pw}
    });
    if (!user) {
        return await zParse(userLoginFailedOutput,{errormessage: 'Wrong username or Password'});
    }
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign({name: user.name, pw: user.id, id: user.id, tokenType: 'accessToken'},
        process.env.JWT_SECRET_KEY ?? '', {expiresIn: process.env.ACCESS_TOKEN_EXPIRE ?? '30min'});
    const refreshToken = jwt.sign({name: user.name, pw: user.pw, id: user.id, tokenType: 'refreshToken'},
        process.env.JWT_SECRET_KEY ?? '', {expiresIn: process.env.REFRESH_TOKEN_EXPIRE ?? '1h'});

    await tokenService.addTokenAtLogin({accessToken: token}, {refreshToken}, {userId: user.id});
    return zParse(userLoginDTOOutput, {
        message: 'Login Success, token added successfully',
        accessToken: token,
        refreshToken,
        userId: user.id,
        currentTime: now
    });
}

export async function registerUser(user: ZUserSchemaInput) {

    const existentUser = await prisma.pilot_user.findFirst({
        where: { name: user.name }
    });

    if (existentUser) {
        return zParse(
            userAlreadyExistDTOOutput,
            { message: 'Username already exists', name: user.name }
        );
    }

    await prisma.pilot_user.create({
        data: { name: user.name, pw: user.pw }
    });

    return zParse(
        userRegisterDTOOutput,
        { message: 'User registration successful', name: user.name, password: user.pw }
    );
}


export async function getUserById_new(accessToken: ZAccessTokenInput) {
    const decodedAccessToken = jwt.decode(accessToken.accessToken) as JwtPayload;
    return prisma.pilot_user.findFirst({
        where: {id: decodedAccessToken.id}
    });
}

export async function deleteUserByIdFromToken(accessToken:ZAccessTokenInput){
    const decodedAccessToken = jwt.decode(accessToken.accessToken) as JwtPayload;
    try{
        await prisma.pilot_user.delete({
            where:{id: decodedAccessToken.id}
        })

        await deleteTokensByLogout_new({accessToken:accessToken.accessToken});
        return await zParse(userDeletedOutPut, {message: 'User deleted successfully'});
    } catch (err){
        console.log(err);
        return zParse(userDeletedOutPutError,{errormessage: 'User not found'})
    }


}
export async function storedProcedureTesting(){
    console.log('Result: ' + await prisma.$queryRaw`EXEC CH_LOGIN N'react', N'1433'`);
    return prisma.$queryRaw`EXEC CH_LOGIN N'sysdba', N'1433'`;
}







