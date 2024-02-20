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
exports.addTokenAtLogin = exports.deleteTokensByLogOut = exports.refreshToken = exports.deleteExpiredTokens = exports.addToken = void 0;
const refreshTokenDTO_1 = require("../dto/refreshTokenDTO");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const tokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string()
});
function addToken(token, userId, res, currentTime, tokenType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.tokens.create({
                data: {
                    token: token,
                    user_id: userId,
                    created_at: currentTime,
                    token_type: tokenType
                },
            });
            console.log(tokenType + ' added successfully: ' + token);
        }
        catch (err) {
            console.log('Something went wrong: ' + err);
            return res.status(401).json({
                message: 'Something went wrong',
                err: err
            });
        }
    });
}
exports.addToken = addToken;
function deleteExpiredTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const fiveMinutesAgo = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
        const thirtySecondsAgo = Math.floor((Date.now() - 30 * 1000) / 1000);
        const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
        try {
            const deleteExpiredTokens = yield prisma.tokens.deleteMany({
                where: {
                    created_at: {
                        lt: thirtySecondsAgo
                    },
                    token_type: 'accessToken'
                }
            });
            const deleteExpiredRefreshTokens = yield prisma.tokens.deleteMany({
                where: {
                    created_at: {
                        lt: oneDayAgo
                    },
                    token_type: 'refreshToken'
                }
            });
            console.log('Deleted accessToken(s): ' + deleteExpiredTokens.count + ' Deleted refreshToken(s): '
                + deleteExpiredRefreshTokens.count);
        }
        catch (err) {
            console.log('Something went wrong when deleting tokens:' + err);
        }
    });
}
exports.deleteExpiredTokens = deleteExpiredTokens;
function refreshToken(refreshToken, res) {
    var _a;
    try {
        const validateParam = tokenSchema.parse({ refreshToken: refreshToken });
        const now = Math.floor(new Date().getTime() / 1000);
        const secretKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
        jsonwebtoken_1.default.verify(refreshToken, secretKey, (err, payload) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            if (err) {
                console.log('Invalid token ' + err);
                return res.sendStatus(403);
            }
            if (payload.tokenType != 'refreshToken') {
                console.log('You cannot generate new access token with access token');
                return res.status(403).json({
                    message: 'You cannot generate new access token with access token'
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ name: payload.name, pw: payload.pw, id: payload.id }, (_b = process.env.JWT_SECRET_KEY) !== null && _b !== void 0 ? _b : '', { expiresIn: "30s" });
            yield addToken(accessToken, payload.id, res, now, 'accessToken');
            const body = new refreshTokenDTO_1.RefreshTokenDTO('New access token generated', accessToken);
            console.log('New acces token generated', accessToken);
            return res.status(200).json(body);
        }));
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({
            message: 'Something went wrong',
            err: err
        });
    }
}
exports.refreshToken = refreshToken;
function deleteTokensByLogOut(accessToken, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteExpiredTokens = yield prisma.tokens.deleteMany({
                where: {
                    token: accessToken,
                    token_type: 'accessToken'
                }
            });
            const deleteExpiredRefreshTokens = yield prisma.tokens.deleteMany({
                where: {
                    token: refreshToken,
                    token_type: 'refreshToken'
                }
            });
            console.log('Deleted accessToken(s):' + deleteExpiredTokens.count + 'Deleted refreshToken(s): '
                + deleteExpiredRefreshTokens.count);
        }
        catch (err) {
            console.log('Something went wrong when deleting tokens:' + err);
        }
    });
}
exports.deleteTokensByLogOut = deleteTokensByLogOut;
function addTokenAtLogin() {
}
exports.addTokenAtLogin = addTokenAtLogin;
