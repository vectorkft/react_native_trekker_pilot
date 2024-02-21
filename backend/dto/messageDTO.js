"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDTO = void 0;
class MessageDTO {
    constructor(message) {
        if (!message) {
            throw new Error('Invalid parameters');
        }
        this.message = message;
    }
}
exports.MessageDTO = MessageDTO;
