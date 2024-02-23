import {z} from "zod";

const jwtRegex = /(^[\w-]*\.[\w-]*\.[\w-]*$)/;
export const refreshTokenDTOOutput=z.object({
        message:z.string(),
        refreshToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),

})

export const RefreshBodySchemaInput=z.object({
        refreshToken: z.string(),
})

export type ZrefreshTokenOutput = z.infer<typeof refreshTokenDTOOutput>

