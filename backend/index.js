"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cron = __importStar(require("node-cron"));
const tokenServices_1 = require("./services/tokenServices");
const TokenMiddleware_1 = require("./middleware/TokenMiddleware");
const LogMiddleWare_1 = require("./middleware/LogMiddleWare");
const userRoutes_1 = require("./routes/userRoutes");
const tokenRoutes_1 = require("./routes/tokenRoutes");
const productRoutes_1 = require("./routes/productRoutes");
const app = (0, express_1.default)();
const HTTP_PORT = 8000;
// Body parsing middleware
app.use(express_1.default.json(), LogMiddleWare_1.Logger);
app.use(express_1.default.urlencoded({ extended: false }));
// Token verification middleware for protected routes
userRoutes_1.protectedUserRouter.use(TokenMiddleware_1.verifyToken);
productRoutes_1.protectedProductRouter.use(TokenMiddleware_1.verifyToken);
// Public endpoints
app.use('/user', userRoutes_1.userRouter);
app.use('/token', tokenRoutes_1.tokenRouter);
// Protected endpoints
app.use('/protected/user', userRoutes_1.protectedUserRouter);
app.use('/protected/product', productRoutes_1.protectedProductRouter);
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
app.get('/', (req, res) => {
    return res.status(200).json('Check postman for guidance');
});
cron.schedule("* * * * *", tokenServices_1.deleteExpiredTokens_new);
// Státusz ellenőrzések, nem fontos
app.all('/check', (res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});
