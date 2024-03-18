import {z} from "zod";

const jwtRegex = /(^[\w-]*\.[\w-]*\.[\w-]*$)/;
export const refreshTokenDTOOutput=z.object({
        message:z.string(),
        newAccessToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),

})

export const RefreshBodySchemaInput=z.object({
        refreshToken: z.string(),
})

export const RefreshBodyErrorMessage= z.object({
        errorMessage: z.string(),
});
export const AccessTokenInput=z.object({
        accessToken: z.string(),
})


export type ZrefreshTokenOutput = z.infer<typeof refreshTokenDTOOutput>
export type ZrefreshTokenInput = z.infer<typeof RefreshBodySchemaInput>
export type ZAccessTokenInput = z.infer<typeof AccessTokenInput>


