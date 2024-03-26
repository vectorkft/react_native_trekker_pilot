/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *       example:
 *         {"value":"5997710400167","validTypesArray":{"propList":[{"type":"ean","parseType":{"_def":{"unknownKeys":"strip","catchall":{"_def":{"typeName":"ZodNever"}},"typeName":"ZodObject"},"_cached":{"shape":{"value":{"_def":{"schema":{"_def":{"schema":{"_def":{"checks":[],"typeName":"ZodString","coerce":false}},"typeName":"ZodEffects","effect":{"type":"refinement"}}},"typeName":"ZodEffects","effect":{"type":"refinement"}}}},"keys":["value"]}}},{
 * "type":"etk","parseType":{"_def":{"unknownKeys":"strip","catchall":{"_def":{"typeName":"ZodNever"}},"typeName":"ZodObject"},"_cached":{"shape":{"value":{"_def":{"checks":[{"kind":"min","value":1,"message":"Minimum 1 karakter hosszúnak kell lennie a cikkszámnak!"},{"kind":"max","value":21,"message":"Túl lépted a maximum 21 karaktert!"}],"typeName":"ZodString","coerce":false}}},"keys":["value"]}}}]}}
 */