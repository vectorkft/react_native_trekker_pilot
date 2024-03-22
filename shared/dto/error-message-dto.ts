import {z} from '../node_modules/zod';

export const errorMessageDTO= z.object({
    errorMessage: z.string()
})