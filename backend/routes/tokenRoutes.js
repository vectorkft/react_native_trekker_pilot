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
exports.tokenRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const zodDTO_1 = require("../dto/zodDTO");
const tokenService = __importStar(require("../services/tokenServices"));
const refresh_token_dto_1 = require("../../shared/dto/refresh.token.dto");
const tokenServiceNew = __importStar(require("../services/servicesNew/tokenServiceNew"));
exports.tokenRouter = express_1.default.Router();
exports.tokenRouter.post('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodySchemaInput, req.body);
        const body = yield tokenService.refreshToken({ refreshToken: validData.refreshToken });
        if ('errorMessage' in body) {
            //Ha van errorMessage akkor rossz a token amit kaptunk
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    }
    catch (e) {
        //ha zodError van
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(e));
    }
}));
//// FOR TESTING PURPOSE ONLY
exports.tokenRouter.post('/refreshTeszt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(refresh_token_dto_1.RefreshBodySchemaInput, req.body);
        const body = yield tokenServiceNew.refreshToken_new({ refreshToken: validData.refreshToken });
        if ('errorMessage' in body) {
            //Ha van errorMessage akkor rossz a token amit kaptunk
            return res.status(403).json(body);
        }
        return res.status(200).json(body);
    }
    catch (e) {
        //ha zodError van
        return res.status(400).json(e);
    }
}));
