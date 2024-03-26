/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - pw
 *         - deviceData
 *       properties:
 *         name:
 *           type: string
 *
 *
 *         pw:
 *           type: string
 *
 *
 *         deviceData:
 *           type: object
 *           description: Eszköz infó (ezt az appban nem kell kitölteni, automatikusan történik a háttérben)
 *           properties:
 *             brand:
 *               type: string
 *               description: The brand of the device
 *             manufacturer:
 *               type: string
 *               description: The device manufacturer
 *             deviceName:
 *               type: string
 *               description: The name of the device
 *             deviceId:
 *               type: string
 *               description: The device identifier
 *       example:
 *         name: abcbaja
 *         pw: a
 *         deviceData:
 *           brand: Apple
 *           manufacturer: Foxconn
 *           deviceName: iPhone 13
 *           deviceId: A123456
 */

