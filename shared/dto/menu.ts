import {z} from '../node_modules/zod';
export const MenuInput=z.object({
    id: z.string()

})

export const MenuData= z.object({
    id: z.string(),
    title: z.string(),
    hotkey: z.string(),
})
export const MenuListOutput= z.object({
    data: z.array(MenuData),
    count: z.number(),
    info: z.string(),
})

export type ZMenuInput=z.infer<typeof MenuInput>;