"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDTO = void 0;
class RefreshTokenDTO {
    constructor(message, newAccessToken) {
        if (!message || !newAccessToken) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.newAccessToken = newAccessToken;
    }
}
exports.RefreshTokenDTO = RefreshTokenDTO;
