import { z } from 'zod';
import jwt from 'jsonwebtoken';

export const UserLoginDTO = {
    accessToken: "",
    refreshToken: "",
    userId: "",
};


const UserLoginDTOSchema = z.object({
    accessToken: z.string().refine(token => jwt.verify(token, process.env.JWT_SECRET), {
        message: 'Access token must be a valid JWT',
    }),
    refreshToken: z.string().refine(token => jwt.verify(token, process.env.JWT_SECRET), {
        message: 'Refresh token must be a valid JWT',
    }),
    userId: z.number(),
});

const validUserLoginDTO = UserLoginDTOSchema.safeParse(UserLoginDTO);

// if (validUserLoginDTO.success) {
//     console.log('UserLoginDTO is valid');
// } else {
//     console.log('UserLoginDTO is invalid:', validUserLoginDTO.error);
// }
