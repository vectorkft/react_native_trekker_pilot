import {z} from '../node_modules/zod';
export const MenuInput=z.object({
    id: z.string()

})

export type ZMenuInput=z.infer<typeof MenuInput>;