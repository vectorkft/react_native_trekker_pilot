"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTokensByUserId = exports.deleteTokensByLogout_new = exports.deleteExpiredTokens_new = exports.refreshToken_new = exports.addTokenAtLogin = void 0;
const refreshTokenDTO_1 = require("../dto/refreshTokenDTO");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const RefreshBodySchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
function addTokenAtLogin(accessToken, refreshToken, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken);
        const decodedRefreshToken = jsonwebtoken_1.default.decode(refreshToken);
        if (!decodedRefreshToken || !decodedAccessToken) {
            throw new Error('Cannot decode token');
        }
        try {
            yield prisma.tokens_v1.create({
                data: {
                    accessToken: accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userId: userId
                }
            });
            console.log('Tokens added');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.addTokenAtLogin = addTokenAtLogin;
function refreshToken_new(refreshToken) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const expireDate = Math.floor(Date.now() / 1000) + 30;
        const secretKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
        RefreshBodySchema.parse({ refreshToken: refreshToken });
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(refreshToken, secretKey, (err, payload) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log('Invalid token ' + err);
                    reject('Invalid token');
                    return;
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ name: payload.name, pw: payload.pw, id: payload.id }, secretKey, { expiresIn: "30s" });
                try {
                    yield prisma.tokens_v1.updateMany({
                        where: {
                            userId: payload.id
                        },
                        data: {
                            accessToken: newAccessToken,
                            accessExpireDate: expireDate
                        },
                    });
                    console.log('Access token successfully refreshed');
                    const body = new refreshTokenDTO_1.RefreshTokenDTO('New access token generated', newAccessToken);
                    resolve(body);
                }
                catch (err) {
                    console.log('An error occurred during refreshing the access token');
                    reject('An error occurred during refreshing the access token');
                }
            }));
        });
    });
}
exports.refreshToken_new = refreshToken_new;
function deleteExpiredTokens_new() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentTime = Math.floor(Date.now() / 1000);
        try {
            const deletedAccessTokens = yield prisma.tokens_v1.updateMany({
                where: {
                    accessExpireDate: {
                        lt: currentTime
                    }
                },
                data: {
                    accessToken: null,
                    accessExpireDate: null
                }
            });
            const deletedRefreshTokens = yield prisma.tokens_v1.updateMany({
                where: {
                    refreshExpireDate: {
                        lt: currentTime
                    }
                },
                data: {
                    refreshToken: null,
                    refreshExpireDate: null
                }
            });
            const deleteTheWholeRecord = yield prisma.tokens_v1.deleteMany({
                where: {
                    accessExpireDate: {
                        lt: currentTime
                    },
                    refreshExpireDate: {
                        lt: currentTime
                    }
                }
            });
            console.log('Deleted Access token(s) ' + deletedAccessTokens.count + ' || ' + 'Deleted Refresh Token(s) ' + deletedRefreshTokens.count);
            console.log('Deleted record(s) ' + deleteTheWholeRecord.count);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteExpiredTokens_new = deleteExpiredTokens_new;
function deleteTokensByLogout_new(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.tokens_v1.deleteMany({
                where: {
                    accessToken: accessToken
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteTokensByLogout_new = deleteTokensByLogout_new;
function deleteTokensByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.tokens_v1.deleteMany({
                where: {
                    userId: userId
                }
            });
        }
        catch (err) {
        }
    });
}
exports.deleteTokensByUserId = deleteTokensByUserId;
// export async function addToken(token: string, userId: number, res : Response, currentTime: number,tokenType: string){
//     try{
//         await prisma.tokens.create({
//             data: {
//                 token: token,
//                 user_id: userId,
//                 created_at: currentTime,
//                 token_type: tokenType
//             },
//         })
//
//         console.log(tokenType+' added successfully: '+token);
//     } catch (err) {
//         console.log('Something went wrong: ' + err)
//         return res.status(401).json({
//             message: 'Something went wrong',
//             err: err
//         })
//     }
//
//
//
// }
//
//
// export async function deleteExpiredTokens(){
//     const fiveMinutesAgo = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
//     const thirtySecondsAgo = Math.floor((Date.now() - 30 * 1000) / 1000);
//
//     const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
//     try {
//         const deleteExpiredTokens = await prisma.tokens.deleteMany({
//             where: {
//                 created_at: {
//                     lt: thirtySecondsAgo
//                 },
//                 token_type: 'accessToken'
//             }
//         })
//         const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
//             where: {
//                 created_at: {
//                     lt: oneDayAgo
//                 },
//                 token_type: 'refreshToken'
//             }
//         })
//         console.log('Deleted accessToken(s): ' + deleteExpiredTokens.count + ' Deleted refreshToken(s): '
//         + deleteExpiredRefreshTokens.count);
//     } catch (err) {
//         console.log('Something went wrong when deleting tokens:' + err)
//     }
//
// }
//
// export function refreshToken(refreshToken : string , res: Response){
//     try{
//         const validateParam=tokenSchema.parse({refreshToken: refreshToken})
//         const now = Math.floor(new Date().getTime() / 1000);
//         const secretKey = process.env.JWT_SECRET_KEY ?? ''
//
//
//         jwt.verify(refreshToken, secretKey, async (err: any, payload: any) => {
//             if (err) {
//                 console.log('Invalid token ' + err);
//                 return res.sendStatus(403);
//             }
//             if(payload.tokenType!='refreshToken'){
//                 console.log('You cannot generate new access token with access token');
//                 return res.status(403).json({
//                     message: 'You cannot generate new access token with access token'
//                 });
//             }
//             const accessToken=jwt.sign({name: payload.name, pw: payload.pw, id: payload.id},
//                 process.env.JWT_SECRET_KEY ?? '',{ expiresIn: "30s"});
//             await addToken(accessToken, payload.id, res, now, 'accessToken');
//             const body=new RefreshTokenDTO('New access token generated', accessToken)
//             console.log('New access token generated', accessToken);
//             return res.status(200).json(body);
//         })
//     }catch (err){
//         console.log(err);
//         return res.status(401).json({
//             message: 'Something went wrong',
//             err: err
//         })
//     }
//
//
// }
// export async function deleteTokensByLogOut(accessToken: string, refreshToken:string){
//     try {
//         const deleteExpiredTokens = await prisma.tokens.deleteMany({
//             where: {
//                 token: accessToken,
//                 token_type: 'accessToken'
//             }
//         })
//
//         const deleteExpiredRefreshTokens = await prisma.tokens.deleteMany({
//             where: {
//                 token: refreshToken,
//                 token_type: 'refreshToken'
//             }
//         })
//         console.log('Deleted accessToken(s):'+ deleteExpiredTokens.count +'Deleted refreshToken(s): '
//             + deleteExpiredRefreshTokens.count);
//
//
//     } catch (err) {
//         console.log('Something went wrong when deleting tokens:' + err)
//
//     }
// }
