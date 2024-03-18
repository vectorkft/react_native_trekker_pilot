import * as tokenService from './tokenServices';
import jwt from "jsonwebtoken";
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';
import {JwtPayload} from "../models/JwtPayload";
import {
    userAlreadyExistDTOOutput,
    userLoginDTOOutput,
    userLoginFailedOutput,
    userRegisterDTOOutput,
    ZUserSchemaInput
} from "../../shared/dto/user.dto";
import {zParse} from "../../shared/services/zod-dto.service";
import {ZAccessTokenInput} from "../../shared/dto/refresh.token.dto";



dotenv.config()
const prisma = new PrismaClient({log: ['info'],})


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











