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
exports.getUserById = exports.deleteUser = exports.registerUser = exports.loginUser = exports.readAll = void 0;
const tokenService = __importStar(require("./tokenServices"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const registerDTO_1 = require("../dto/registerDTO");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const loginDTO_1 = require("../dto/loginDTO");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(6, { message: "Username must be 6 or more characters long" }),
    pw: zod_1.z.string().min(6, { message: "Password must be 6 or more characters long" }),
});
//Read all users
// TODO RESPOONSOKAT KISZEDNI, SZÉPEN VISSZA ADNI A BODY JSONT
function readAll(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const allUsers = yield prisma.tokens.findMany();
        console.log('users: ' + allUsers);
        return res.status(200).json({
            users: allUsers
        });
    });
}
exports.readAll = readAll;
function loginUser(name, password, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedParams = UserSchema.parse({ name: name, pw: password });
            const user = yield prisma.user.findFirst({
                where: { name: name, pw: password }
            });
            if (user) {
                const userId = user.id;
                const now = Math.floor(new Date().getTime() / 1000);
                const token = jsonwebtoken_1.default.sign({ name: name, pw: password, id: userId, tokenType: 'accessToken' }, (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '', { expiresIn: "30s" });
                const refreshToken = jsonwebtoken_1.default.sign({ name: name, pw: password, id: userId, tokenType: 'refreshToken' }, (_b = process.env.JWT_SECRET_KEY) !== null && _b !== void 0 ? _b : '', { expiresIn: "1d" });
                // await tokenService.addToken(refreshToken, userId,res, now, 'refreshToken');
                // await tokenService.addToken(token, userId,res, now, 'accessToken');
                yield tokenService.addTokenAtLogin(token, refreshToken, userId);
                const body = new loginDTO_1.loginDTO('Login Succes, token added succesfully', token, refreshToken, userId, now);
                return res.status(200).json(body);
            }
            else {
                console.log('Hibás felhasználónév vagy jelszó');
                return res.status(401).json({
                    message: 'Hibás felhasználónév vagy jelszó'
                });
            }
        }
        catch (err) {
            console.log('Invalid parameters ' + err);
            res.status(401).json({
                message: 'Invalid parameters',
                err: err
            });
        }
    });
}
exports.loginUser = loginUser;
function registerUser(name, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validatedParams = UserSchema.parse({ name: name, pw: password });
            yield prisma.user.create({
                data: {
                    name: name,
                    pw: password,
                },
            });
            const body = new registerDTO_1.registerDTO('User registration successful', name, password);
            res.status(200).json(body);
        }
        catch (err) {
            console.log('Invalid parameters' + err);
            res.status(401).json({
                message: 'Invalid parameters',
                err: err
            });
        }
    });
}
exports.registerUser = registerUser;
function deleteUser(id, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const delUser = yield prisma.user.delete({ where: {
                    id: id
                } });
            console.log('User deleted');
            return res.status(200).json({
                message: 'User deleted'
            });
        }
        catch (err) {
            console.log('Something went wrong when deleting a user');
            return res.status(404).json({
                message: 'User deleting went wrong',
                err: err
            });
        }
    });
}
exports.deleteUser = deleteUser;
function getUserById(id, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findFirst({
                where: { id: id }
            });
            if (!user) {
                return res.status(404).json('A kért felhasználó nem található');
            }
            return res.status(200).json(user);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.getUserById = getUserById;
