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
exports.isAccessTokenInDatabase = exports.signTokensFromTokenPayload = exports.signTokens = exports.refreshToken = exports.deleteTokensByLogout = exports.deleteExpiredTokens_new = exports.addTokenAtLogin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chalk_1 = __importDefault(require("chalk"));
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const refresh_token_dto_1 = require("../../shared/dto/refresh.token.dto");
const user_dto_1 = require("../../shared/dto/user.dto");
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
    });
}
exports.addTokenAtLogin = addTokenAtLogin;
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
            console.log(chalk_1.default.green('-------------------------------'));
            console.log(chalk_1.default.green('Deleted Access token(s) ' + deletedAccessTokens.count + '\n' + 'Deleted Refresh Token(s) ' + deletedRefreshTokens.count));
            console.log(chalk_1.default.green('Deleted record(s) ' + deleteTheWholeRecord.count));
            console.log(chalk_1.default.green('-------------------------------'));
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteExpiredTokens_new = deleteExpiredTokens_new;
function deleteTokensByLogout(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.tokens_v2.deleteMany({
            where: {
                accessToken: accessToken.accessToken
            }
        });
    });
}
exports.deleteTokensByLogout = deleteTokensByLogout;
function refreshToken(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield isRefreshTokenInDatabase({ refreshToken: refreshToken.refreshToken }))) {
            return yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodyErrorMessage, { errorMessage: 'You tried to use AccessToken as RefreshToken' });
        }
        const payload = yield retrieveUserInfoFromRefreshToken(refreshToken);
        const accessToken = yield signTokensFromTokenPayload('accessToken', 'ACCESS_TOKEN_EXPIRE', payload);
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken);
        yield prisma.tokens_v2.updateMany({
            where: { userName: payload.name },
            data: { accessToken: accessToken, accessExpireDate: decodedAccessToken.exp },
        });
        const body = yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.refreshTokenDTOOutput, { message: 'New access token generated', newAccessToken: accessToken });
        return body;
    });
}
exports.refreshToken = refreshToken;
function isRefreshTokenInDatabase(refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.tokens_v2.findFirst({
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
function signTokensFromTokenPayload(tokenType, expiresIn, userInput) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ name: userInput.name, szemelykod: userInput.szemelykod, tokenType }, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { expiresIn: (_b = process.env[expiresIn]) !== null && _b !== void 0 ? _b : '1h' });
    });
}
exports.signTokensFromTokenPayload = signTokensFromTokenPayload;
function isAccessTokenInDatabase(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.tokens_v2.findFirst({
            where: {
                accessToken: accessToken.accessToken
            }
        }).then(token => !!token);
    });
}
exports.isAccessTokenInDatabase = isAccessTokenInDatabase;
function retrieveUserInfoFromRefreshToken(token) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
        const payload = jsonwebtoken_1.default.verify(token.refreshToken, secretKey);
        return (0, zod_dto_service_1.zParse)(user_dto_1.userPayLoadInput, { name: payload.name, szemelykod: payload.szemelykod });
    });
}
