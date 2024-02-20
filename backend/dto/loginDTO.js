"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDTO = void 0;
class loginDTO {
    constructor(message, accessToken, refreshToken, userId, currentTime) {
        if (!message || !accessToken || !userId || !currentTime) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.currentTime = currentTime;
    }
}
exports.loginDTO = loginDTO;
