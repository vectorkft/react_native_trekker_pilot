import * as tokenService from './tokenServices';
import {deleteTokensByLogout_new} from './tokenServices';
import jwt from "jsonwebtoken";
import {z} from 'zod'
import {registerDTO} from "../dto/registerDTO";
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv';
import {loginDTO} from "../dto/loginDTO";
import {ProfileDTO} from "../dto/profileDTO";
import {JwtPayload} from "../models/JwtPayload";
import {MessageDTO} from "../dto/messageDTO";



dotenv.config()
const prisma = new PrismaClient()
const UserSchema = z.object({
    name: z.string().min(6, { message: "Username must be 6 or more characters long" }),
    pw: z.string().min(6, { message: "Password must be 6 or more characters long" }),
});


// export async function readAll() {
//     const allUsers =await prisma.tokens.findMany();
//
//     console.log('users: ' + allUsers)
//     return allUsers;
// }



export async function loginUser(name: string, password: string) {

    try {
        UserSchema.parse({name: name, pw: password});
        const user=await prisma.user.findFirst({
            where:{ name : name, pw: password}

        })
        if(user){
            const userId=user.id
            const now = Math.floor(new Date().getTime() / 1000);
            const token = jwt.sign({name: name, pw: password,id: userId, tokenType: 'accessToken'},
                process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "30s"});
            const refreshToken=jwt.sign({name: name, pw: password, id: userId, tokenType:'refreshToken'},
                process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "1d"});
            await tokenService.addTokenAtLogin(token,refreshToken,userId);
            return new loginDTO('Login Success, token added successfully', token, refreshToken, userId, now);
        }
        else {
            console.log('Wrong username or password');
            return "Wrong username or password";
        }




    } catch (err) {
        console.log('Invalid parameters ' + err)
        throw err;
    }
}

export async function registerUser(name: string, password: string) {
    try{
        UserSchema.parse({name: name, pw: password});
            await prisma.user.create({
                data: {
                    name: name,
                    pw: password,
                },
            })
        return new registerDTO('User registration successful', name, password)

    } catch (err : any) {
        console.log('Invalid parameters'+ err)
        throw err;
    }

}

// export async function deleteUser(id: number, res :Response){
//     try {
//         const delUser=await prisma.user.delete({where: {
//                 id: id
//             }})
//         console.log('User deleted');
//         return res.status(200).json({
//             message: 'User deleted'
//         })
//     }
//     catch (err)
//     {
//         console.log('Something went wrong when deleting a user')
//         return res.status(404).json({
//             message: 'User deleting went wrong',
//             err: err
//         })
//     }
// }

// export async function getUserById(id:number,res:Response){
//     try{
//         const user= await prisma.user.findFirst({
//             where:{id: id}
//         })
//         if(!user){
//             return res.status(404).json('User not found');
//         }
//         return res.status(200).json(user);
//     } catch (err){
//         console.log(err);
//     }
// }

export async function getUserById_new(accessToken:string){
    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    try{
        const user= await prisma.user.findFirst({
            where:{id: decodedAccessToken.id}
        })
        if(!user){
            return false;
        }
        return new ProfileDTO(user.name??'');
    } catch (err){
        console.log(err);
    }
}

export async function deleteUserByIdFromToken(accessToken:string){
    const decodedAccessToken = jwt.decode(accessToken) as JwtPayload;
    try{
        const user= await prisma.user.delete({
            where:{id: decodedAccessToken.id}
        })
        if(!user){
            return false;
        }
        await deleteTokensByLogout_new(accessToken);
        return new MessageDTO('Account has been deleted successfully');
    } catch (err){
        console.log(err);
    }


}








