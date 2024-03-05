"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleListOutput = exports.cikkSzamSchemaInput = exports.cikkEANSchemaInput = exports.ArticleDataOutput = exports.ArticleDTOOutput2 = exports.ArticleDTOOutput = void 0;
const zod_1 = require("zod");
const luhn_validation_1 = require("luhn-validation");
exports.ArticleDTOOutput = zod_1.z.object({
    cikkszam: zod_1.z.number(),
    cikknev: zod_1.z.string(),
    eankod: zod_1.z.bigint(),
});
exports.ArticleDTOOutput2 = zod_1.z.object({
    cikkszam: zod_1.z.number(),
    cikknev: zod_1.z.string(),
    eankod: zod_1.z.string(),
});
exports.ArticleDataOutput = zod_1.z.object({
    key: zod_1.z.string(),
    title: zod_1.z.string(),
    value: zod_1.z.string(),
});
exports.cikkEANSchemaInput = zod_1.z.object({
    eankod: zod_1.z.number().refine(value => value.toString().length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!.')
        .refine(value => (0, luhn_validation_1.ean)(value), 'Nem valid EAN kód'),
});
exports.cikkSzamSchemaInput = zod_1.z.object({
    cikkszam: zod_1.z.number(),
});
exports.ArticleListOutput = zod_1.z.object({
    data: zod_1.z.array(exports.ArticleDataOutput),
    count: zod_1.z.number(),
});
