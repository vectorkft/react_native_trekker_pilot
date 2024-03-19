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
exports.protectedProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const product_dto_1 = require("../../shared/dto/product.dto");
const cikkService = __importStar(require("../services/productService"));
const zodDTO_1 = require("../dto/zodDTO");
const cikkServiceNew = __importStar(require("../services/servicesNew/cikkServiceNew"));
const library_1 = require("@prisma/client/runtime/library");
exports.protectedProductRouter = express_1.default.Router();
exports.protectedProductRouter.post('/getCikkByEAN', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(product_dto_1.ProductEANSchemaInput, req.body);
        const body = yield cikkService.getCikkByEanKod(validData);
        if (!body) {
            return res.status(204).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json(err);
    }
}));
exports.protectedProductRouter.post('/getCikk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(product_dto_1.ProductNumberSchemaInput, req.body);
        const body = yield cikkService.getCikkByCikkszam(validData);
        if (body === "Not found") {
            return res.status(204).json({ message: 'Not found' });
        }
        return res.status(200).json(body);
    }
    catch (err) {
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
//// TESTING
exports.protectedProductRouter.post('/getCikkTeszt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(product_dto_1.ProductNumberSchemaInput, req.body);
        const body = yield cikkServiceNew.getCikkByCikkszam(validData, { accessToken: accessToken });
        if (body === "Not found") {
            return res.status(204).json({ message: 'Not found' });
        }
        return res.status(200).json(body);
    }
    catch (err) {
        if (err instanceof library_1.PrismaClientRustPanicError) {
            return res.status(401).json('Invalid username or password');
        }
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
exports.protectedProductRouter.post('/getCikkByEANTeszt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const authHeader = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : '';
    const accessToken = authHeader.split(' ')[1];
    try {
        const validData = yield (0, zod_dto_service_1.zParse)(product_dto_1.ProductEANSchemaInput, req.body);
        const body = yield cikkServiceNew.getCikkByEanKod(validData, { accessToken: accessToken });
        if (!body) {
            return res.status(204).json(body);
        }
        return res.status(200).json(body);
    }
    catch (err) {
        if (err instanceof library_1.PrismaClientRustPanicError) {
            return res.status(401).json('Invalid username or password');
        }
        return res.status(400).json(zodDTO_1.ZodDTO.fromZodError(err));
    }
}));
