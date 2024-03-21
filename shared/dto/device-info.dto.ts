import {z} from '../../node_modules/zod';

export const DeviceInfoDTO = z.object({
    brand: z.string(),
    manufacturer: z.string(),
    deviceName: z.string(),
    deviceId: z.string(),
});

export type ZDeviceInfoDTO = z.infer<typeof DeviceInfoDTO>