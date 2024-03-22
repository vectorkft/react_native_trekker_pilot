import * as tokenService from './token';
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';

import {zParse} from "../../shared/services/zod";

import {dbConnectionCheck} from "./db-connection-check";
import {
    UserLoginDTOOutput,
    ZUserLoginDTOInput,
} from "../../shared/dto/user-login";
import {DeviceInfoEnum} from "../../shared/enums/device-info";
import {errorMessageDTO} from "../../shared/dto/error-message";
import {UserNotFound} from "../errors/user-not-found";




dotenv.config()
const prisma = new PrismaClient();


export async function loginUser(userInput: ZUserLoginDTOInput) {

        await dbConnectionCheck(userInput);

        const device=await deviceInfoHelper(JSON.stringify(userInput.deviceData));

        const user=await prisma.sTATION.findFirst({
            where:{USERNEV: userInput.name }
        })


        if (!user) {
            throw new UserNotFound(userInput.name);
        }
        const szemelyKod=user.UGYINTEZO;

        const accessToken =await tokenService.signTokens('accessToken','ACCESS_TOKEN_EXPIRE',userInput,szemelyKod??0);

        const refreshToken=await  tokenService.signTokens('refreshToken','REFRESH_TOKEN_EXPIRE',userInput,szemelyKod??0);

        await tokenService.addTokenAtLogin({accessToken}, {refreshToken}, userInput, szemelyKod??0);

        return zParse(UserLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken,
            refreshToken,
            userName: user.USERNEV,
            deviceType: device,
        });
}


//TODO: Itt a Zebrát is enumból kéne vagy ilyesmi
async function deviceInfoHelper(deviceData: string){
        if(deviceData.includes('Zebra')){
            return DeviceInfoEnum.trekker;
        }
        return DeviceInfoEnum.mobile;

}













