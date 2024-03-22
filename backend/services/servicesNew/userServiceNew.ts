import {dbConnect} from "./dbConnectService";
import {zParse} from "../../../shared/services/zod";
import * as tokenServiceNew from "./tokenServiceNew";
import {UserLoginDTOOutput, ZUserLoginDTOInput} from "../../../shared/dto/user-login";
import {DeviceInfoEnum} from "../../../shared/enums/device-info";


export async function loginWithDB(userInput: ZUserLoginDTOInput) {
        const device=await deviceInfoHelper(JSON.stringify(userInput.deviceData));
        const prismaA =await dbConnect(userInput);
        const user= await prismaA.pilot_user.findFirst({
            where: {name: userInput.name, pw: userInput.pw}
        });

        if(!user){
            return ['User not found'];
        }

        const accessToken= await tokenServiceNew.signTokens('accessToken','ACCESS_TOKEN_EXPIRE',userInput);

        const refreshToken= await tokenServiceNew.signTokens('refreshToken','REFRESH_TOKEN_EXPIRE',userInput);

        await tokenServiceNew.addTokenAtLogin({accessToken}, {refreshToken}, userInput);

        return zParse(UserLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken: accessToken,
            refreshToken,
            userName: userInput.name,
            deviceType: device,
        });

}


async function deviceInfoHelper(deviceData: string){
    if(deviceData.includes('Zebra')){
        return DeviceInfoEnum.trekker;
    }
    return DeviceInfoEnum.mobile;

}