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
const zod_1 = require("zod");
const luhn_validation_1 = require("luhn-validation");
const cikkDTO_1 = require("../dto/cikkDTO");
const cikkNotFoundDTO_1 = require("../dto/cikkNotFoundDTO");
const prisma = new client_1.PrismaClient();
const cikkEANSchema = zod_1.z.object({
    eankod: zod_1.z.number().refine(value => value.toString().length === 13, {
        message: "Az EAN kód pontosan 13 karakter hosszú kell legyen.",
    }).refine(value => (0, luhn_validation_1.ean)(value), {
        message: 'Nem valid EAN kód',
    }),
});
const cikkSchema = zod_1.z.object({
    cikkszam: zod_1.z.number(),
});
function getCikkByCikkszam(cikkszam) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            cikkSchema.parse({ cikkszam: cikkszam });
            const cikk = yield prisma.cikk.findFirst({
                where: {
                    cikkszam: cikkszam
                }
            });
            if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
                return "Not found";
            }
            return new cikkDTO_1.CikkDTO(cikk.cikkszam, cikk.cikknev, Number(cikk.eankod));
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
            cikkEANSchema.parse({ eankod: eankod });
            const cikk = yield prisma.cikk.findFirst({
                where: {
                    eankod: eankod
                }
            });
            if (!cikk || !cikk.cikkszam || !cikk.cikknev || !cikk.eankod) {
                return new cikkNotFoundDTO_1.CikkNotFoundDTO('Not found', eankod);
            }
            return new cikkDTO_1.CikkDTO(cikk.cikkszam, cikk.cikknev, Number(cikk.eankod));
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    });
}
exports.getCikkByEanKod = getCikkByEanKod;
