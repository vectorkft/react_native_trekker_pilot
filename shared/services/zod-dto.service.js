"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateZDTOForm = exports.parseZodError = exports.zParse = void 0;
const zod_1 = require("zod");
const Sentry = __importStar(require("@sentry/react"));
function zParse(schema, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return schema.parseAsync(data);
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                Sentry.captureException(new Error(error.message));
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
            Sentry.withScope(scope => {
                scope.setContext('myContext', { info: 'Hiba az üzenet feldolgozásakor' });
                Sentry.captureException(error);
            });
            return '';
        }
    });
}
exports.parseZodError = parseZodError;
function validateZDTOForm(schema, formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield zParse(schema, formData);
            Sentry.captureMessage("DTO body", body);
        }
        catch (error) {
            Sentry.captureException(error);
            return {
                isValid: false,
                error: error,
            };
        }
        return {
            error: null,
            isValid: true,
        };
    });
}
exports.validateZDTOForm = validateZDTOForm;
