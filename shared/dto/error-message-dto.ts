import {z} from "zod";

export const errorMessageDTO= z.object({
    errorMessage: z.string()
})