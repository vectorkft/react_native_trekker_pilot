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
exports.deleteUserByIdFromToken = exports.getUserById_new = exports.registerUser = exports.loginUser = void 0;
const tokenService = __importStar(require("./tokenServices"));
const tokenServices_1 = require("./tokenServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const profileDTO_1 = require("../dto/profileDTO");
const messageDTO_1 = require("../dto/messageDTO");
const user_dto_1 = require("../../shared/dto/user.dto");
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function loginUser(name, password) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // UserSchema.parse({name: name, pw: password});
            const user = yield prisma.user.findFirst({
                where: { name: name, pw: password }
            });
            if (user) {
                const userId = user.id;
                const now = Math.floor(new Date().getTime() / 1000);
                const token = jsonwebtoken_1.default.sign({ name: name, pw: password, id: userId, tokenType: 'accessToken' }, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { expiresIn: "30min" });
                const refreshToken = jsonwebtoken_1.default.sign({ name: name, pw: password, id: userId, tokenType: 'refreshToken' }, (_b = process.env.JWT_SECRET_KEY) !== null && _b !== void 0 ? _b : '', { expiresIn: "1h" });
                yield tokenService.addTokenAtLogin(token, refreshToken, userId);
                const body = yield (0, zod_dto_service_1.zParse)(user_dto_1.userLoginDTOOutput, { message: 'Login Success, token added successfully', accessToken: token,
                    refreshToken: refreshToken, userId: userId, currentTime: now });
                return body;
                //return new loginDTO('Login Success, token added successfully', token, refreshToken, userId, now);
            }
            else {
                console.log('Wrong username or password');
                return "Wrong username or password";
            }
        }
        catch (err) {
            console.log('Invalid parameters ' + err);
            throw err;
        }
    });
}
exports.loginUser = loginUser;
function registerUser(name, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existed = yield prisma.user.findFirst({
                where: {
                    name: name,
                }
            });
            if (existed) {
                const body = yield (0, zod_dto_service_1.zParse)(user_dto_1.userAlreadyExistDTOOutput, { message: 'Username already exists', name: name });
                //return new MessageDTO('Username already exists');
                return body;
            }
            yield prisma.user.create({
                data: {
                    name: name,
                    pw: password,
                },
            });
            const body = yield (0, zod_dto_service_1.zParse)(user_dto_1.userRegisterDTOOutput, { message: 'User registration successful', username: name, password: password });
            return body;
            //return new registerDTO('User registration successful', name, password)
        }
        catch (err) {
            console.log('Invalid parameters' + err);
            throw err;
        }
    });
}
exports.registerUser = registerUser;
function getUserById_new(accessToken) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken);
        try {
            const user = yield prisma.user.findFirst({
                where: { id: decodedAccessToken.id }
            });
            if (!user) {
                return false;
            }
            return new profileDTO_1.ProfileDTO((_a = user.name) !== null && _a !== void 0 ? _a : '');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.getUserById_new = getUserById_new;
function deleteUserByIdFromToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const decodedAccessToken = jsonwebtoken_1.default.decode(accessToken);
        try {
            const user = yield prisma.user.delete({
                where: { id: decodedAccessToken.id }
            });
            if (!user) {
                return false;
            }
            yield (0, tokenServices_1.deleteTokensByLogout_new)(accessToken);
            return new messageDTO_1.MessageDTO('Account has been deleted successfully');
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.deleteUserByIdFromToken = deleteUserByIdFromToken;
