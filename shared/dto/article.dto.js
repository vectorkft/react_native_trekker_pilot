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
exports.zParse = exports.cikkSzamSchemaInput = exports.cikkEANSchemaInput = exports.ArticleDTOOutput = void 0;
const zod_1 = require("zod");
const luhn_validation_1 = require("luhn-validation");
exports.ArticleDTOOutput = zod_1.z.object({
    cikkszam: zod_1.z.number(),
    cikknev: zod_1.z.string(),
    eankod: zod_1.z.bigint(),
});
exports.cikkEANSchemaInput = zod_1.z.object({
    eankod: zod_1.z.number().refine(value => value.toString().length === 13, {
        message: "Az EAN kód pontosan 13 karakter hosszú kell legyen!.",
    }).refine(value => (0, luhn_validation_1.ean)(value), {
        message: 'Nem valid EAN kód',
    }),
});
exports.cikkSzamSchemaInput = zod_1.z.object({
    cikkszam: zod_1.z.number(),
});
function zParse(schema, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return schema.parseAsync(data);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                throw new Error(error.message);
            }
            return new Error(JSON.stringify(error));
        }
    });
}
exports.zParse = zParse;
