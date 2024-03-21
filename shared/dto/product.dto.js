"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductListOutput = exports.ProductGeneralSchema = exports.ProductNumberSchemaInput = exports.ProductEANSchemaInput = exports.ProductDataOutput = void 0;
const zod_1 = require("../../node_modules/zod");
const luhn_validation_1 = require("luhn-validation");
exports.ProductDataOutput = zod_1.z.object({
    key: zod_1.z.string(),
    title: zod_1.z.string(),
    value: zod_1.z.string(),
});
exports.ProductEANSchemaInput = zod_1.z.object({
    value: zod_1.z.string().refine(value => value.length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!')
        .refine(value => (0, luhn_validation_1.ean)(Number(value)), 'Nem valid EAN kód!'),
    validType: zod_1.z.enum(["ean" /* ValidTypes.ean */, "both" /* ValidTypes.both */]).describe('Valid EAN type'),
});
exports.ProductNumberSchemaInput = zod_1.z.object({
    value: zod_1.z.string().min(1, 'Minimum 1 karakter hosszúnak kell lennie a cikkszámnak!').max(21, 'Túl lépted a maximum 21 karaktert!'),
    validType: zod_1.z.enum(["etk" /* ValidTypes.etk */]).describe('Valid EAN type'),
});
exports.ProductGeneralSchema = zod_1.z.object({
    value: zod_1.z.string(),
    validType: zod_1.z.enum(["ean" /* ValidTypes.ean */, "both" /* ValidTypes.both */, "etk" /* ValidTypes.etk */]).describe('Valid EAN type'),
});
exports.ProductListOutput = zod_1.z.object({
    data: zod_1.z.array(exports.ProductDataOutput),
    count: zod_1.z.number(),
});
