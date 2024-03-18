"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDeletedOutPutError = exports.userDeletedOutPut = exports.userAlreadyExistDTOOutput = exports.userSchemaInput = exports.UserIdInput = exports.userLoginFailedOutput = exports.userRegisterDTOOutput = exports.userLoginDTOOutputNew = exports.userLoginDTOOutput = void 0;
const zod_1 = require("zod");
exports.userLoginDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    userId: zod_1.z.number(),
    currentTime: zod_1.z.number()
});
exports.userLoginDTOOutputNew = zod_1.z.object({
    message: zod_1.z.string(),
    accessToken: zod_1.z.string(),
    refreshToken: zod_1.z.string(),
    userName: zod_1.z.string(),
    currentTime: zod_1.z.number()
});
exports.userRegisterDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.userLoginFailedOutput = zod_1.z.object({
    errormessage: zod_1.z.string(),
});
exports.UserIdInput = zod_1.z.object({
    userId: zod_1.z.number(),
});
exports.userSchemaInput = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Username must be 6 or more characters long" }),
    pw: zod_1.z.string().min(1, { message: "Password must be 6 or more characters long" }),
});
exports.userAlreadyExistDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.userDeletedOutPut = zod_1.z.object({
    message: zod_1.z.string(),
});
exports.userDeletedOutPutError = zod_1.z.object({
    errormessage: zod_1.z.string(),
});
