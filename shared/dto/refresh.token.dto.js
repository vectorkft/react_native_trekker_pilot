"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenInput = exports.RefreshBodyErrorMessage = exports.RefreshBodySchemaInput = exports.refreshTokenDTOOutput = void 0;
const zod_1 = require("zod");
const jwtRegex = /(^[\w-]*\.[\w-]*\.[\w-]*$)/;
exports.refreshTokenDTOOutput = zod_1.z.object({
    message: zod_1.z.string(),
    newAccessToken: zod_1.z.string().refine(token => jwtRegex.test(token), { message: "Érvénytelen JWT token" }),
});
exports.RefreshBodySchemaInput = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
exports.RefreshBodyErrorMessage = zod_1.z.object({
    errorMessage: zod_1.z.string(),
});
exports.AccessTokenInput = zod_1.z.object({
    accessToken: zod_1.z.string(),
});
