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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
function verifyToken(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        const secretKey = (_a = process.env.JWT_SECRET_KEY) !== null && _a !== void 0 ? _a : '';
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            // if(!await tokenService.isAccessTokenInDatabase({accessToken: token})){
            //     console.log('Invalid token');
            //     return res.sendStatus(403);
            // }
            jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
                if (err) {
                    console.log('Invalid token :' + err);
                    return res.sendStatus(403);
                }
                console.log('Valid token');
                next();
            });
        }
        else {
            res.sendStatus(403);
        }
    });
}
exports.verifyToken = verifyToken;
