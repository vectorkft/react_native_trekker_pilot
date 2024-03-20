"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
function Logger(req, res, next) {
    const timestamp = new Date().toISOString();
    const { method, url, ip, body } = req;
    console.log(chalk_1.default.cyan(`
          Incoming Request
          
          ${timestamp} 
          ${method} ${url} 
          ${ip}
          ${JSON.stringify(body)}`));
    next();
}
exports.Logger = Logger;
