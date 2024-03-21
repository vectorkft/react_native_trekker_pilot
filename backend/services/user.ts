import * as tokenService from './token';
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';

import {zParse} from "../../shared/services/zod-dto.service";

import {dbConnectionCheck} from "./db-connection-check";
import {
    UserLoginDTOOutput,
    userSchemaInput,
    ZUserLoginDTOInput,
    ZUserSchemaInput
} from "../../shared/dto/user-login.dto";
import {DeviceInfoEnum} from "../../shared/enums/device-info";
import {errorMessageDTO} from "../../shared/dto/error-message-dto";




dotenv.config()
const prisma = new PrismaClient();


export async function loginUser(userInput: ZUserLoginDTOInput) {

        await dbConnectionCheck(userInput);

        const device=await deviceInfoHelper(JSON.stringify(userInput.deviceData));

        const user=await prisma.sTATION.findFirst({
            where:{USERNEV: userInput.name }
        })


        if (!user) {
            return await zParse(errorMessageDTO,{errorMessage: 'Wrong username'});
        }
        const szemelyKod=user.UGYINTEZO;

        const accessToken =await tokenService.signTokens('accessToken','ACCESS_TOKEN_EXPIRE',userInput,szemelyKod??0);

        const refreshToken=await  tokenService.signTokens('refreshToken','REFRESH_TOKEN_EXPIRE',userInput,szemelyKod??0);

        await tokenService.addTokenAtLogin({accessToken}, {refreshToken}, userInput);

        return zParse(UserLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken,
            refreshToken,
            userName: user.USERNEV,
            deviceType: device,
        });
}

export async function registerUser(user: ZUserSchemaInput) {

    const existentUser = await prisma.pilot_user.findFirst({
        where: { name: user.name }
    });

    if (existentUser) {
        return zParse(
            errorMessageDTO,
            { errorMessage: 'Username already exists : '+ user.name },
        );
    }

    await prisma.pilot_user.create({
        data: { name: user.name, pw: user.pw }
    });

    return zParse(
        userSchemaInput,
        { name: user.name, pw: user.pw }
    );
}

async function deviceInfoHelper(deviceData: string){
        if(deviceData.includes('Zebra')){
            return DeviceInfoEnum.trekker;
        }
        return DeviceInfoEnum.mobile;

}













