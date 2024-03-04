"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAlreadyExistDTOOutput = exports.userSchemaInput = exports.userRegisterDTOOutput = exports.userLoginDTOOutput = void 0;
const zod_1 = require("zod");
exports.userLoginDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    userId: zod_1.z.number(),
    currentTime: zod_1.z.number()
});
exports.userRegisterDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.userSchemaInput = zod_1.z.object({
    name: zod_1.z.string().min(6, { message: "Username must be 6 or more characters long" }),
    pw: zod_1.z.string().min(6, { message: "Password must be 6 or more characters long" }),
});
exports.userAlreadyExistDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
});
