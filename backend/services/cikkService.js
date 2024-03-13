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
const article_dto_1 = require("../../shared/dto/article.dto");
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const prisma = new client_1.PrismaClient();
function getCikkByCikkszam(cikkszam) {
    return __awaiter(this, void 0, void 0, function* () {
        const cikk = yield prisma.cikk.findFirst({
            where: {
                cikkszam: cikkszam.cikkszam
            }
        });
        if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
            return "Not found";
        }
        return (0, zod_dto_service_1.zParse)(article_dto_1.ProductDTOOutput, cikk);
    });
}
exports.getCikkByCikkszam = getCikkByCikkszam;
function getCikkByEanKod(eankod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cikk = yield prisma.cikk.findMany({
                where: {
                    eankod: eankod.eankod
                }
            });
            if (cikk.length === 0) {
                return false;
            }
            const result = {
                data: cikk.flatMap((cikkElement) => [
                    article_dto_1.ProductDataOutput.parse({
                        key: 'cikkszam',
                        title: 'Cikkszám',
                        value: cikkElement.cikkszam.toString(),
                    }),
                    article_dto_1.ProductDataOutput.parse({
                        key: 'cikknev',
                        title: 'Cikknév',
                        value: cikkElement.cikknev.toString(),
                    }),
                    article_dto_1.ProductDataOutput.parse({
                        key: 'eankod',
                        title: 'EAN Kód',
                        value: cikkElement.eankod.toString(),
                    }),
                ]),
                count: cikk.length
            };
            return article_dto_1.ProductListOutput.parse(result);
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getCikkByEanKod = getCikkByEanKod;
