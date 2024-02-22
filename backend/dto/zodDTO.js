"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodDTO = void 0;
class ZodDTO {
    constructor(code, message, expected, received, path) {
        if (!code) {
            throw new Error('Invalid parameters');
        }
        this.code = code !== null && code !== void 0 ? code : '';
        this.message = message !== null && message !== void 0 ? message : '';
        this.expected = expected;
        this.received = received;
        this.path = path.join('.');
    }
    static fromZodError(err) {
        if (err.issues && err.issues.length > 0) {
            return err.issues.map((issue) => new ZodDTO(issue.code, issue.message, issue.expected, issue.received, issue.path));
        }
        else {
            console.error(err);
            throw new Error('An unexpected error occurred');
        }
    }
}
exports.ZodDTO = ZodDTO;
