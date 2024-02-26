import {z} from 'zod';

const jwtRegex = /(^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$)/;

export const TokenDTOInput = z.object({
    refreshToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),
});
export const TokenDTOOutput = z.object({
    newAccessToken: z.string().refine(token => jwtRegex.test(token), {message: "Érvénytelen JWT token"}),
});

export type ZTokenDTOInput = z.infer<typeof TokenDTOInput>;

export type ZTokenDTOOutput = z.infer<typeof TokenDTOOutput>;

