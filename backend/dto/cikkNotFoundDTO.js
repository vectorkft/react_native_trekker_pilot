"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CikkNotFoundDTO = void 0;
class CikkNotFoundDTO {
    constructor(message, ean) {
        if (!message || !ean) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.ean = ean;
    }
}
exports.CikkNotFoundDTO = CikkNotFoundDTO;
