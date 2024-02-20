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
const app = (0, express_1.default)();
const HTTP_PORT = 8000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json(), LogMiddleWare_1.Logger);
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
app.get('/', (res) => {
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
    yield userserv.loginUser(req.body.name, req.body.pw, res);
    console.log(req.body);
}));
app.post('/protected', TokenMiddleware_1.verifyToken, (req, res) => {
    return res.status(200).json({ message: 'Protected route accessed' });
});
app.post('/refresh', (req, res) => {
    tokenserv.refreshToken(req.body.refreshToken, res);
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userserv.registerUser(req.body.name, req.body.pw, res);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }
}));
app.post('/deleteUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userserv.deleteUser(req.body.id, res);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during deletion.');
    }
}));
cron.schedule("* * * * *", tokenServices_1.deleteExpiredTokens);
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
        yield cikkserv.getCikkByCikkszam(req.body.cikkszam, res);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }
}));
app.post('/getCikkByEAN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cikkserv.getCikkByEanKod(req.body.eankod, res);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred during registration.');
    }
}));
app.post('/profile', TokenMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userserv.getUserById(req.body.id, res);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong: ' + err);
    }
}));
app.post('/logout', TokenMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    const accesToken = authHeader.split(' ')[1];
    const refreshToken = req.body.refreshToken;
    try {
        yield tokenserv.deleteTokensByLogOut(accesToken, refreshToken);
        return res.status(200).json('Sikeres kijelentkezes');
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Something went wrong:' + err);
    }
}));
