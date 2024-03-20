import {z} from "zod";

export const userRegisterDTOOutput=z.object({
    message:z.string(),
    name:z.string(),
    password:z.string(),
})

export const userLoginFailedOutput=z.object({
    errormessage: z.string(),
})


export const userSchemaInput = z.object({
    name: z.string().min(1, { message: "Username must be 6 or more characters long" }),
    pw: z.string().min(1, { message: "Password must be 6 or more characters long" }),
});

export const userAlreadyExistDTOOutput = z.object({
    message: z.string(),
    name: z.string(),
})

export const userPayLoadInput= z.object({
    name: z.string(),
    szemelykod:z.number(),
})

export type ZUserSchemaInput = z.infer<typeof userSchemaInput>
export type ZuserPayloadInput= z.infer<typeof userPayLoadInput>

