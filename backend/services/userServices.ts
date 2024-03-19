import * as tokenService from './tokenServices';
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';

import {
    userAlreadyExistDTOOutput,
    userLoginFailedOutput,
    userRegisterDTOOutput,
    ZUserSchemaInput
} from "../../shared/dto/user.dto";
import {zParse} from "../../shared/services/zod-dto.service";

import {dbConnectionCheck} from "./dbConnectionCheck";
import {UserLoginDTOOutput, ZUserLoginDTOInput} from "../../shared/dto/user-login.dto";
import {DeviceInfoEnum} from "../../shared/enums/device-info";




dotenv.config()
const prisma = new PrismaClient({log: ['info'],})


export async function loginUser(userInput: ZUserLoginDTOInput) {
    console.log(JSON.stringify(userInput.deviceData))
        await dbConnectionCheck(userInput);
        const device=await deviceInfoHelper(JSON.stringify(userInput.deviceData));
        const user= await prisma.pilot_user.findFirst({
            where:{ name: userInput.name, pw: userInput.pw}
        });

        if (!user) {
            return await zParse(userLoginFailedOutput,{errormessage: 'Wrong username or Password'});
        }

        const token =await tokenService.signTokens('accessToken','ACCESS_TOKEN_EXPIRE',userInput);

        const refreshToken=await  tokenService.signTokens('refreshToken','REFRESH_TOKEN_EXPIRE',userInput);

        await tokenService.addTokenAtLogin({accessToken: token}, {refreshToken}, userInput);

        return zParse(UserLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken: token,
            refreshToken,
            userName: user.name,
            deviceType: device,
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

async function deviceInfoHelper(deviceData: string){
        if(deviceData.includes('Zebra')){
            return DeviceInfoEnum.trekker;
        }
        return DeviceInfoEnum.mobile;

}













