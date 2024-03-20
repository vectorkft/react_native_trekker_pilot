"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPayLoadInput = exports.userAlreadyExistDTOOutput = exports.userSchemaInput = exports.userLoginFailedOutput = exports.userRegisterDTOOutput = void 0;
const zod_1 = require("zod");
exports.userRegisterDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.userLoginFailedOutput = zod_1.z.object({
    errormessage: zod_1.z.string(),
});
exports.userSchemaInput = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Username must be 6 or more characters long" }),
    pw: zod_1.z.string().min(1, { message: "Password must be 6 or more characters long" }),
});
exports.userAlreadyExistDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.userPayLoadInput = zod_1.z.object({
    name: zod_1.z.string(),
    szemelykod: zod_1.z.number(),
});
