import {z} from 'zod';

const jwtRegex = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/;

export const UserLoginDTOInput = z.object({
    name: z.string().min(6).max(100).describe("Username"),
    pw: z.string().min(6).max(100).describe("Password"),
});

export const UserLoginDTOOutput = z.object({
    accessToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),
    refreshToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),
    userId: z.number(),
});

export type ZUserLoginDTOInput = z.infer<typeof UserLoginDTOInput>;

export type ZUserLoginDTOOutput = z.infer<typeof UserLoginDTOOutput>;

