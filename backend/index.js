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
const express_1 = __importDefault(require("express"));
const userserv = __importStar(require("./services/userServices"));
const cikkserv = __importStar(require("./services/cikkService"));
const body_parser_1 = __importDefault(require("body-parser"));
const tokenserv = __importStar(require("./services/tokenServices"));
const cron = __importStar(require("node-cron"));
const tokenServices_1 = require("./services/tokenServices");
const TokenMiddleware_1 = require("./middleware/TokenMiddleware");
const LogMiddleWare_1 = require("./middleware/LogMiddleWare");
const zodDTO_1 = require("./dto/zodDTO");
const cikkNotFoundDTO_1 = require("./dto/cikkNotFoundDTO");
const article_dto_1 = require("../shared/dto/article.dto");
const zod_dto_service_1 = require("../shared/services/zod-dto.service");
const refresh_token_dto_1 = require("../shared/dto/refresh.token.dto");
const messageDTO_1 = require("./dto/messageDTO");
const user_dto_1 = require("../shared/dto/user.dto");
const app = (0, express_1.default)();
const HTTP_PORT = 8000;
BigInt.prototype.toJSON = function () {
    return this.toString();
};
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json(), LogMiddleWare_1.Logger);
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
app.get('/', (req, res) => {
    const data = {
        vegpont: '/login',
        amitker: {
            name: "sanyi",
            pw: "asd"
        },
        amivisszaad: {
            message: "Login Succes, token added succesfully",
            accesToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGVnam9iYm5ldjIiLCJwdyI6ImxlZ2pvYmJqZWxzem9pcyIsImlhdCI6MTcwODMzNTY3MCwiZXhwIjoxNzA4MzM1OTcwfQ.qmlxF317wdVir6R7TZLbJRXsJhCsk7dnZ9idM9rWKvw",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGVnam9iYm5ldjIiLCJwdyI6ImxlZ2pvYmJqZWxzem9pcyIsImlkIjoyNCwiaWF0IjoxNzA4MzM1NjcwLCJleHAiOjE3MDg0MjIwNzB9.NxpGpI0RRW43QmAwAuNoOqrQNXQcZrLzne8UpEUaobc",
            userId: 24,
            currentTime: 1708335670
        },
    };
    return res.status(400).send('<pre>' + JSON.stringify(data, null, 2) + '</pre>');
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(user_dto_1.userSchemaInput, req.body);
        const body = yield userserv.loginUser(validData.name, validData.pw);
        if (body === 'Wrong username or password') {
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).send(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
app.post('/protected', TokenMiddleware_1.verifyToken, (req, res) => {
    return res.status(200).json({ message: 'Protected route accessed' });
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(user_dto_1.userSchemaInput, req.body);
        const body = yield userserv.registerUser(req.body.name, req.body.pw);
        if ('message' in body && body.message === 'Username already exists' /*body instanceof MessageDTO*/) {
            return res.status(409).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).send(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
cron.schedule("* * * * *", tokenServices_1.deleteExpiredTokens_new);
// Státusz ellenőrzések, nem fontos
app.get('/version', (res) => {
    return res.status(200).json({
        message: '1'
    });
});
app.all('/check', (res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});
app.post('/getCikk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(article_dto_1.cikkSzamSchemaInput, req.body);
        const body = yield cikkserv.getCikkByCikkszam(validData.cikkszam);
        if (body === "Not found") {
            return res.status(404).json({ message: 'Not found' });
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
app.post('/getCikkByEAN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(article_dto_1.cikkEANSchemaInput, req.body);
        const body = yield cikkserv.getCikkByEanKod(validData.eankod);
        if (body instanceof cikkNotFoundDTO_1.CikkNotFoundDTO) {
            return res.status(204).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
app.post('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodySchemaInput, req.body);
        const body = yield tokenserv.refreshToken_new(validData.refreshToken);
        if (body instanceof messageDTO_1.MessageDTO) {
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    }
    catch (e) {
        return res.status(403).json(zodDTO_1.ZodDTO.fromZodError(e));
    }
}));
app.get('/logout', TokenMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    const accesToken = authHeader.split(' ')[1];
    try {
        yield tokenserv.deleteTokensByLogout_new(accesToken);
        return res.status(200).json('Logout successful');
    }
    catch (e) {
        return res.status(403).json('err' + e);
    }
}));
app.post('/profile', TokenMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authHeader = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        const body = yield userserv.getUserById_new(accessToken);
        if (!body) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(404).send('Something went wrong: ' + err);
    }
}));
app.post('/deleteUser', TokenMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const authHeader = (_c = req.headers.authorization) !== null && _c !== void 0 ? _c : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        const body = yield userserv.deleteUserByIdFromToken(accessToken);
        if (!body) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(404).send('Something went wrong: ' + err);
    }
}));
app.post('/login2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield userserv.loginUser(req.body.name, req.body.pw);
        if (body === 'Wrong username or password') {
            return res.status(401).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
