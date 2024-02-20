"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
function Logger(req, res, next) {
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(`
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}`);
    next();
}
exports.Logger = Logger;
