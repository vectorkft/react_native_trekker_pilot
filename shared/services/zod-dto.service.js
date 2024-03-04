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
exports.parseResponseMessages = exports.parseZodError = exports.zParse = void 0;
const zod_1 = require("zod");
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
function parseZodError(error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = JSON.parse(error.message);
            const messages = msg.map((m) => m.message);
            return messages.join(', ');
        }
        catch (e) {
            console.log('Hiba a hibaüzenet feldolgozásakor:', e);
            return '';
        }
    });
}
exports.parseZodError = parseZodError;
function parseResponseMessages(response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let messages = [];
            for (let key in response) {
                if (response[key].message) {
                    messages.push(response[key].message);
                }
            }
            return messages.join(', ');
        }
        catch (e) {
            console.log('Hiba a válaszüzenetek feldolgozásakor:', e);
            return '';
        }
    });
}
exports.parseResponseMessages = parseResponseMessages;
