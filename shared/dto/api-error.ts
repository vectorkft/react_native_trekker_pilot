import {z} from '../../node_modules/zod';

export const ApiError = z.object({
    status: z.number(),
    error: z.string(),
    data: z.unknown(),
});

export type ZApiError = z.infer<typeof ApiError>;