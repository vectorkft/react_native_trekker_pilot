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
exports.getCikkByEanKod = exports.getCikkByCikkszam = void 0;
const client_1 = require("@prisma/client");
const product_dto_1 = require("../../shared/dto/product.dto");
const prisma = new client_1.PrismaClient();
function getCikkByCikkszam(cikkszam) {
    return __awaiter(this, void 0, void 0, function* () {
        const cikk = yield prisma.raktar_eancikkek.findMany({
            where: {
                etk: cikkszam.cikkszam
            }
        });
        if (cikk.length === 0) {
            return false;
        }
        return processArticles(cikk);
    });
}
exports.getCikkByCikkszam = getCikkByCikkszam;
function getCikkByEanKod(eankod) {
    return __awaiter(this, void 0, void 0, function* () {
        const cikk = yield prisma.raktar_eancikkek.findMany({
            where: {
                jellemzo: eankod.eankod
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
            product_dto_1.ProductDataOutput.parse({
                key: 'etk',
                title: 'ETK',
                value: articleElement.etk,
            }),
            product_dto_1.ProductDataOutput.parse({
                key: 'cikknev',
                title: 'Cikknév',
                value: articleElement.CIKKNEV1,
            }),
            product_dto_1.ProductDataOutput.parse({
                key: 'eankod',
                title: 'EAN Kód',
                value: articleElement.jellemzo,
            }),
        ]),
        count: articles.length
    };
    return product_dto_1.ProductListOutput.parse(result);
};