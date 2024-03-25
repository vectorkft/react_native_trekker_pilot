import {z} from '../node_modules/zod';
import {DeviceInfoDTO} from "./device-info";
import {DeviceInfoEnum} from "../enums/device-info";

const jwtRegex = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/;

export const UserLoginDTOInput = z.object({
  name: z
    .string()
    .min(5, 'A felhasználónév hossza minimum 6 karakter kell legyen!')
    .max(100, 'A felhasználónév hossza maximum 100 karakter lehet!')
    .describe('Username'),
  pw: z
    .string()
    .min(1, 'A jelszó hossza minimum 1 karakter kell legyen!')
    .max(100, 'A jelszó hossza maximum 100 karakter lehet!')
    .describe('Password'),
  deviceData: DeviceInfoDTO.describe('Device Info'),
});

export const UserLoginDTOOutput = z.object({
  message: z.string(),
  accessToken: z
    .string()
    .refine(token => jwtRegex.test(token), {message: 'Érvénytelen JWT token'}),
  refreshToken: z
    .string()
    .refine(token => jwtRegex.test(token), {message: 'Érvénytelen JWT token'}),
  userName: z.string(),
  deviceType: z.enum([DeviceInfoEnum.trekker,DeviceInfoEnum.mobile]).describe('Device Type'),
});

//Ezt még bele raktam,kell hogy majd a szemelykoddal tudjak mókolni
export const userPayLoadInput= z.object({
  name: z.string(),
  szemelykod:z.number(),
})

export type ZuserPayloadInput= z.infer<typeof userPayLoadInput>

export type ZUserLoginDTOInput = z.infer<typeof UserLoginDTOInput>;

export type ZUserLoginDTOOutput = z.infer<typeof UserLoginDTOOutput>;
