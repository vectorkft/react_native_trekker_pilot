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
exports.getCikkByEanKod2 = exports.getCikkByEanKod = exports.getCikkByCikkszam = void 0;
const client_1 = require("@prisma/client");
const cikkNotFoundDTO_1 = require("../dto/cikkNotFoundDTO");
const article_dto_1 = require("../../shared/dto/article.dto");
const zod_dto_service_1 = require("../../shared/services/zod-dto.service");
const prisma = new client_1.PrismaClient();
function getCikkByCikkszam(cikkszam) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cikk = yield prisma.cikk.findFirst({
                where: {
                    cikkszam: cikkszam
                }
            });
            if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
                return "Not found";
            }
            const body = yield (0, zod_dto_service_1.zParse)(article_dto_1.ArticleDTOOutput, cikk);
            return body;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}
exports.getCikkByCikkszam = getCikkByCikkszam;
function getCikkByEanKod(eankod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cikk = yield prisma.cikk.findFirst({
                where: {
                    eankod: eankod
                }
            });
            if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
                return new cikkNotFoundDTO_1.CikkNotFoundDTO('Not found', eankod);
            }
            console.log(typeof eankod);
            const body = yield (0, zod_dto_service_1.zParse)(article_dto_1.ArticleDTOOutput, cikk);
            return body;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}
exports.getCikkByEanKod = getCikkByEanKod;
function getCikkByEanKod2(eankod) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cikk = yield prisma.cikk.findMany({
                where: {
                    eankod: eankod
                }
            });
            if (cikk.length === 0) {
                return new cikkNotFoundDTO_1.CikkNotFoundDTO('Not found', eankod);
            }
            const result = {
                data: [],
                count: 0
            };
            for (let i = 0; i < cikk.length; i++) {
                const temp = [
                    article_dto_1.ArticleDataOutput.parse({
                        key: 'cikkszam',
                        title: 'Cikkszám',
                        value: cikk[i].cikkszam.toString(),
                    }),
                    article_dto_1.ArticleDataOutput.parse({
                        key: 'cikknev',
                        title: 'Cikknév',
                        value: cikk[i].cikknev.toString(),
                    }),
                    article_dto_1.ArticleDataOutput.parse({
                        key: 'eankod',
                        title: 'EAN Kód',
                        value: cikk[i].eankod.toString(),
                    }),
                ];
                result.data.push(...temp);
                result.count += 1;
            }
            return article_dto_1.ArticleListOutput.parse(result);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}
exports.getCikkByEanKod2 = getCikkByEanKod2;
