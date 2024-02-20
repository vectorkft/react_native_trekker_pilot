"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDTO = void 0;
class tokenDTO {
    constructor(message) {
        if (!message) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
    }
}
exports.tokenDTO = tokenDTO;
