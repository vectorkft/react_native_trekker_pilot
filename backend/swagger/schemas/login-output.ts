/**
 * @swagger
 * components:
 *   schemas:
 *     User Output:
 *       type: object
 *       required:
 *         - message
 *         - accessToken
 *         - refreshToken
 *         - userName
 *         - deviceType
 *       properties:
 *         message:
 *           type: string
 *
 *         accessToken:
 *           type: string
 *           description: JWT Token
 *
 *         refreshToken:
 *           type: string
 *           description: JWT Token
 *
 *         userName:
 *           type: string
 *
 *         deviceType:
 *           type: string
 *           enum: [trekker, mobile]
 *           description: Device Type
 *       example:
 *           message: 'Login Success, token added successfully'
 *           accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3lzZGJhIiwic3plbWVseWtvZCI6MSwidG9rZW5UeXBlIjoiYWNjZXNzVG9rZW4iLCJpYXQiOjE3MTEzODAyMzAsImV4cCI6MTcxMTM4MTEzMH0'
 *           refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic3lzZGJhIiwic3plbWVseWtvZCI6MSwidG9rZW5UeXBlIjoicmVmcmVzaFRva2VuIiwiaWF0IjoxNzExMzgwMjMwLCJleHAiOjE3MTEzODM4MzB9.2AAxORVBkcQXlt7L3KE1C2xLlWdu0GllxmEg-W90h0E'
 *           userName: 'SYSDBA'
 *           deviceType: 'trekker'
 *
 *
 */