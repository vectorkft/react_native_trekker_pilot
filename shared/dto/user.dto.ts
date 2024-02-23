import {z} from "zod";

export const userLoginDTOOutput=z.object({
    message:z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
    userId: z.number(),
    currentTime: z.number()
})
export const userRegisterDTOOutput=z.object({
    message:z.string(),
    username:z.string(),
    password:z.string(),
})


export const userSchemaInput = z.object({
    name: z.string().min(6, { message: "Username must be 6 or more characters long" }),
    pw: z.string().min(6, { message: "Password must be 6 or more characters long" }),
});

export type ZuserLoginDTOOutput = z.infer<typeof userLoginDTOOutput>
export type ZuserRegisterDTOOutput = z.infer<typeof userRegisterDTOOutput>

