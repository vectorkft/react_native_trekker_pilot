"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodDTO = void 0;
class ZodDTO {
    constructor(code, expected, received, path) {
        if (!code || !expected || !received || !path) {
            throw new Error('Invalid parameters');
        }
        this.code = code;
        this.expected = expected;
        this.received = received;
        this.path = path;
    }
}
exports.ZodDTO = ZodDTO;
