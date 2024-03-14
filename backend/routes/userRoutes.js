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
exports.protectedUserRouter = exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const user_dto_1 = require("../../shared/dto/user.dto");
const userService = __importStar(require("../services/userServices"));
const zodDTO_1 = require("../dto/zodDTO");
const tokenService = __importStar(require("../services/tokenServices"));
// Public endpoints
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
// Protected endpoints
const protectedUserRouter = express_1.default.Router();
exports.protectedUserRouter = protectedUserRouter;
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(user_dto_1.userSchemaInput, req.body);
        const body = yield userService.loginUser(validData);
        if ("errormessage" in body) {
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).send(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
userRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(user_dto_1.userSchemaInput, req.body);
        const body = yield userService.registerUser(validData);
        if ('message' in body && body.message === 'Username already exists' /*body instanceof MessageDTO*/) {
            return res.status(409).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).send(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
protectedUserRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        yield tokenService.deleteTokensByLogout_new({ accessToken: accessToken });
        return res.status(200).json('Logout successful');
    }
    catch (e) {
        return res.status(403).json('err' + e);
    }
}));
protectedUserRouter.post('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authHeader = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        const body = yield userService.getUserById_new({ accessToken: accessToken });
        if (!body) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send('Something went wrong: ' + err);
    }
}));
userRouter.post('/teszt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(user_dto_1.userSchemaInput, req.body);
        const body = yield userService.createPrismaClient(validData);
        return res.status(200).json(body);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}));
