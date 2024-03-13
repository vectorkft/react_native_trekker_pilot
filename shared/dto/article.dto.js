"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductListOutput = exports.ProductNumberSchemaInput = exports.ProductEANSchemaInput = exports.ProductDataOutput = exports.ProductDTOOutput = void 0;
const zod_1 = require("zod");
const luhn_validation_1 = require("luhn-validation");
exports.ProductDTOOutput = zod_1.z.object({
    cikkszam: zod_1.z.number(),
    cikknev: zod_1.z.string(),
    eankod: zod_1.z.bigint(),
});
exports.ProductDataOutput = zod_1.z.object({
    key: zod_1.z.string(),
    title: zod_1.z.string(),
    value: zod_1.z.string(),
});
exports.ProductEANSchemaInput = zod_1.z.object({
    eankod: zod_1.z.number().refine(value => value.toString().length === 13, 'Az EAN kód pontosan 13 karakter hosszú kell legyen!.')
        .refine(value => (0, luhn_validation_1.ean)(value), 'Nem valid EAN kód'),
});
exports.ProductNumberSchemaInput = zod_1.z.object({
    cikkszam: zod_1.z.number().refine(value => typeof value === 'number', 'Nem számot adtál meg!'),
});
exports.ProductListOutput = zod_1.z.object({
    data: zod_1.z.array(exports.ProductDataOutput),
    count: zod_1.z.number(),
});
