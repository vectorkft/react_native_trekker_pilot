"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signTokens = exports.refreshToken = exports.deleteTokensByLogout = exports.deleteExpiredTokens_new = exports.deleteExpiredTokens = exports.addTokenAtLogin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const refresh_token_dto_1 = require("../../shared/dto/refresh.token.dto");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
function addTokenAtLogin(accessToken, refreshToken, userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken.accessToken);
        const decodedRefreshToken = jsonwebtoken_1.default.decode(refreshToken.refreshToken);
        if (!decodedRefreshToken || !decodedAccessToken) {
            throw new Error('Cannot decode token');
        }
        try {
            yield prisma.tokens_v2.create({
                data: {
                    accessToken: accessToken.accessToken,
                    accessExpireDate: decodedAccessToken.exp,
                    refreshToken: refreshToken.refreshToken,
                    refreshExpireDate: decodedRefreshToken.exp,
                    userName: userInput.name,
                }
            });
            console.log('Tokens added');
        }
        catch (err) {
            console.log(err);
            return err;
        }
    });
}
exports.addTokenAtLogin = addTokenAtLogin;
function deleteExpiredTokens() {
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
            console.log('-------------------------------');
            console.log('Deleted Access token(s) ' + deletedAccessTokens.count + ' || ' + 'Deleted Refresh Token(s) ' + deletedRefreshTokens.count);
            console.log('Deleted record(s) ' + deleteTheWholeRecord.count);
            console.log('-------------------------------');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteExpiredTokens = deleteExpiredTokens;
function deleteExpiredTokens_new() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentTime = Math.floor(Date.now() / 1000);
        try {
            const deletedAccessTokens = yield prisma.tokens_v2.updateMany({
                where: {
                    accessExpireDate: {
                        lt: currentTime
                    }
                },
                data: {
                    accessToken: null,
                }
            });
            const deletedRefreshTokens = yield prisma.tokens_v2.updateMany({
                where: {
                    refreshExpireDate: {
                        lt: currentTime
                    }
                },
                data: {
                    refreshToken: null,
                }
            });
            const deleteTheWholeRecord = yield prisma.tokens_v2.deleteMany({
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
            console.log('-------------------------------');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteExpiredTokens_new = deleteExpiredTokens_new;
function deleteTokensByLogout(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.tokens_v1.deleteMany({
                where: {
                    accessToken: accessToken.accessToken
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteTokensByLogout = deleteTokensByLogout;
function refreshToken(refreshToken) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //Így megtudom fogni hogy ne lehessen accessTokennel is kérni a refresht
        if (!(yield isRefreshTokenInDatabase({ refreshToken: refreshToken.refreshToken }))) {
            return yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodyErrorMessage, { errorMessage: 'You tried to use AccessToken as RefreshToken' });
        }
        const expireDate = Math.floor(Date.now() / 1000) + 30;
        const secretKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken.refreshToken, secretKey);
            const newAccessToken = jsonwebtoken_1.default.sign({ name: payload.name, pw: payload.pw, id: payload.id }, secretKey, { expiresIn: (_b = process.env.ACCESS_TOKEN_EXPIRE) !== null && _b !== void 0 ? _b : '30min' });
            yield prisma.tokens_v1.updateMany({
                where: { userId: payload.id },
                data: { accessToken: newAccessToken, accessExpireDate: expireDate },
            });
            const body = yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.refreshTokenDTOOutput, { message: 'New access token generated', newAccessToken: newAccessToken });
            return body;
        }
        catch (err) {
            console.log(`An error occurred during refreshing the access token ${err}`);
            return yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodyErrorMessage, { errorMessage: (err instanceof jsonwebtoken_1.JsonWebTokenError) ? err.message : JSON.stringify(err) });
        }
    });
}
exports.refreshToken = refreshToken;
function isRefreshTokenInDatabase(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // Convert the token object to boolean
        return prisma.tokens_v1.findFirst({
            where: {
                refreshToken: refreshToken.refreshToken
            }
        }).then(token => !!token);
    });
}
function signTokens(tokenType, expiresIn, userInput) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ name: userInput.name, szemelykod: 1, tokenType }, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { expiresIn: (_b = process.env[expiresIn]) !== null && _b !== void 0 ? _b : '1h' });
    });
}
exports.signTokens = signTokens;
