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
exports.createPrismaClient = exports.storedProcedureTesting = exports.deleteUserByIdFromToken = exports.getUserById_new = exports.registerUser = exports.loginUser = void 0;
const tokenService = __importStar(require("./tokenServices"));
const tokenServices_1 = require("./tokenServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const user_dto_1 = require("../../shared/dto/user.dto");
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const dbConnectService_1 = require("./dbConnectService");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function loginUser(userInput) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.pilot_user.findFirst({
            where: { name: userInput.name, pw: userInput.pw }
        });
        if (!user) {
            return yield (0, zod_dto_service_1.zParse)(user_dto_1.userLoginFailedOutput, { errormessage: 'Wrong username or Password' });
        }
        const now = Math.floor(Date.now() / 1000);
        const token = jsonwebtoken_1.default.sign({ name: user.name, pw: user.id, id: user.id, tokenType: 'accessToken' }, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { expiresIn: (_b = process.env.ACCESS_TOKEN_EXPIRE) !== null && _b !== void 0 ? _b : '30min' });
        const refreshToken = jsonwebtoken_1.default.sign({ name: user.name, pw: user.pw, id: user.id, tokenType: 'refreshToken' }, (_c = process.env.JWT_SECRET_KEY) !== null && _c !== void 0 ? _c : '', { expiresIn: (_d = process.env.REFRESH_TOKEN_EXPIRE) !== null && _d !== void 0 ? _d : '1h' });
        yield tokenService.addTokenAtLogin({ accessToken: token }, { refreshToken }, { userId: user.id });
        return (0, zod_dto_service_1.zParse)(user_dto_1.userLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken: token,
            refreshToken,
            userId: user.id,
            currentTime: now
        });
    });
}
exports.loginUser = loginUser;
function registerUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const existentUser = yield prisma.pilot_user.findFirst({
            where: { name: user.name }
        });
        if (existentUser) {
            return (0, zod_dto_service_1.zParse)(user_dto_1.userAlreadyExistDTOOutput, { message: 'Username already exists', name: user.name });
        }
        yield prisma.pilot_user.create({
            data: { name: user.name, pw: user.pw }
        });
        return (0, zod_dto_service_1.zParse)(user_dto_1.userRegisterDTOOutput, { message: 'User registration successful', name: user.name, password: user.pw });
    });
}
exports.registerUser = registerUser;
function getUserById_new(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken.accessToken);
        return prisma.pilot_user.findFirst({
            where: { id: decodedAccessToken.id }
        });
    });
}
exports.getUserById_new = getUserById_new;
function deleteUserByIdFromToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken.accessToken);
        try {
            yield prisma.pilot_user.delete({
                where: { id: decodedAccessToken.id }
            });
            yield (0, tokenServices_1.deleteTokensByLogout_new)({ accessToken: accessToken.accessToken });
            return yield (0, zod_dto_service_1.zParse)(user_dto_1.userDeletedOutPut, { message: 'User deleted successfully' });
        }
        catch (err) {
            console.log(err);
            return (0, zod_dto_service_1.zParse)(user_dto_1.userDeletedOutPutError, { errormessage: 'User not found' });
        }
    });
}
exports.deleteUserByIdFromToken = deleteUserByIdFromToken;
function storedProcedureTesting() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Result: ');
            return prisma.$queryRaw `EXEC CH_LOGIN N'react', N'1433'`;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    });
}
exports.storedProcedureTesting = storedProcedureTesting;
function createPrismaClient(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = yield (0, dbConnectService_1.dbConnect)(userInput);
        return yield prisma.pilot_user.findFirst({
            where: { name: userInput.name, pw: userInput.pw }
        });
    });
}
exports.createPrismaClient = createPrismaClient;
