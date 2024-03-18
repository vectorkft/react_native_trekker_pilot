import {z} from "zod";

export const userLoginDTOOutput=z.object({
    message:z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
    userId: z.number(),
    currentTime: z.number()
})
export const userLoginDTOOutputNew=z.object({
    message:z.string(),
    accessToken: z.string(),
    refreshToken: z.string(),
    userName: z.string(),
    currentTime: z.number()
})
export const userRegisterDTOOutput=z.object({
    message:z.string(),
    name:z.string(),
    password:z.string(),
})

export const userLoginFailedOutput=z.object({
    errormessage: z.string(),
})
export const UserIdInput=z.object({
    userId: z.number(),
})

export const userSchemaInput = z.object({
    name: z.string().min(1, { message: "Username must be 6 or more characters long" }),
    pw: z.string().min(1, { message: "Password must be 6 or more characters long" }),
});

export const userAlreadyExistDTOOutput = z.object({
    message: z.string(),
    name: z.string(),
})

export const userDeletedOutPut= z.object({
    message: z.string(),
})
export const userDeletedOutPutError= z.object({
    errormessage: z.string(),
})

export type ZuserAlreadyExistsDTOOutput= z.infer<typeof userAlreadyExistDTOOutput>
export type ZuserLoginDTOOutput = z.infer<typeof userLoginDTOOutput>
export type ZuserRegisterDTOOutput = z.infer<typeof userRegisterDTOOutput>
export type ZUserIdInput = z.infer<typeof UserIdInput>
export type ZUserSchemaInput = z.infer<typeof userSchemaInput>

