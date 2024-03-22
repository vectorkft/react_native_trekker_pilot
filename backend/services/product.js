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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCikkHelper = exports.getCikkByEanKod = exports.getCikkByCikkszam = void 0;
const client_1 = require("@prisma/client");
const product_1 = require("../../shared/dto/product");
const zod_1 = require("../../shared/services/zod");
const prisma = new client_1.PrismaClient();
function getCikkByCikkszam(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const cikk = yield prisma.raktar_eancikkek.findMany({
            where: {
                etk: input.value
            }
        });
        if (cikk.length === 0) {
            return false;
        }
        return processArticles(cikk);
    });
}
exports.getCikkByCikkszam = getCikkByCikkszam;
function getCikkByEanKod(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const cikk = yield prisma.raktar_eancikkek.findMany({
            where: {
                jellemzo: input.value
            }
        });
        if (cikk.length === 0) {
            return false;
        }
        return processArticles(cikk);
    });
}
exports.getCikkByEanKod = getCikkByEanKod;
const processArticles = (articles) => {
    const result = {
        data: articles.flatMap((articleElement) => [
            product_1.ProductDataOutput.parse({
                key: 'etk',
                title: 'ETK',
                value: articleElement.etk,
            }),
            product_1.ProductDataOutput.parse({
                key: 'cikknev',
                title: 'Cikknév',
                value: articleElement.CIKKNEV1,
            }),
            product_1.ProductDataOutput.parse({
                key: 'eankod',
                title: 'EAN Kód',
                value: articleElement.jellemzo,
            }),
        ]),
        count: articles.length
    };
    return product_1.ProductListOutput.parse(result);
};
function getCikkHelper(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input.validTypesArray.includes(ValidTypes.ean)) {
            const validData = yield (0, zod_1.zParse)(product_1.ProductEANSchemaInput, input);
            return yield getCikkByEanKod(validData);
        }
        else if (input.validTypesArray.includes(ValidTypes.etk)) {
            const validData = yield (0, zod_1.zParse)(product_1.ProductNumberSchemaInput, input);
            return yield getCikkByCikkszam(validData);
        }
        return 'Invalid validType';
    });
}
exports.getCikkHelper = getCikkHelper;
