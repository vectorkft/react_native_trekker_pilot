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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const tokenService = __importStar(require("./token"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const zod_dto_service_1 = require("../../shared/services/zod");
const db_connection_check_1 = require("./db-connection-check");
const user_login_dto_1 = require("../../shared/dto/user-login");
const device_info_1 = require("../../shared/enums/device-info");
const error_message_dto_1 = require("../../shared/dto/error-message");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
function loginUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_connection_check_1.dbConnectionCheck)(userInput);
        const device = yield deviceInfoHelper(JSON.stringify(userInput.deviceData));
        const user = yield prisma.sTATION.findFirst({
            where: { USERNEV: userInput.name }
        });
        if (!user) {
            return yield (0, zod_dto_service_1.zParse)(error_message_dto_1.errorMessageDTO, { errorMessage: 'Wrong username' });
        }
        const szemelyKod = user.UGYINTEZO;
        const accessToken = yield tokenService.signTokens('accessToken', 'ACCESS_TOKEN_EXPIRE', userInput, szemelyKod !== null && szemelyKod !== void 0 ? szemelyKod : 0);
        const refreshToken = yield tokenService.signTokens('refreshToken', 'REFRESH_TOKEN_EXPIRE', userInput, szemelyKod !== null && szemelyKod !== void 0 ? szemelyKod : 0);
        yield tokenService.addTokenAtLogin({ accessToken }, { refreshToken }, userInput);
        return (0, zod_dto_service_1.zParse)(user_login_dto_1.UserLoginDTOOutput, {
            message: 'Login Success, token added successfully',
            accessToken,
            refreshToken,
            userName: user.USERNEV,
            deviceType: device,
        });
    });
}
exports.loginUser = loginUser;
function deviceInfoHelper(deviceData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (deviceData.includes('Zebra')) {
            return device_info_1.DeviceInfoEnum.trekker;
        }
        return device_info_1.DeviceInfoEnum.mobile;
    });
}
