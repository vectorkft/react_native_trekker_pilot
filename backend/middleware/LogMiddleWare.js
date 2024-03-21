"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const logDivider = "-------------------------------------------------";
function Logger(req, res, next) {
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(chalk_1.default.cyanBright(`
          ${logDivider}
          Incoming Request
          
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}
          ${logDivider}`));
    // Store the original send method
    const originalSend = res.send;
    // Override the res.send method
    res.send = function (body) {
        let parsedBody;
        try {
            parsedBody = JSON.parse(body.toString());
        }
        catch (e) {
            parsedBody = body;
        }
        console.log(chalk_1.default.yellowBright(`
            ${logDivider}
            Outgoing Response

            ${timestamp}
            ${method} ${url}
            ${ip}
            ${JSON.stringify(parsedBody, null, 2)}
            ${logDivider}`));
        // Call the original send method
        return originalSend.call(res, body);
    };
    next();
}
exports.Logger = Logger;
