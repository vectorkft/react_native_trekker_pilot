"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileDTO = void 0;
class ProfileDTO {
    constructor(username) {
        if (!username) {
            throw new Error('Invalid parameters');
        }
        this.username = username;
    }
}
exports.ProfileDTO = ProfileDTO;
