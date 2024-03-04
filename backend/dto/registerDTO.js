"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDTO = void 0;
class registerDTO {
    constructor(message, username, password) {
        if (!message || !username || !password) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
        this.username = username;
        this.password = password;
    }
}
exports.registerDTO = registerDTO;
