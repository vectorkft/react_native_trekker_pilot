/**
 * @swagger
 *
 *
 *
 * /token/refresh:
 *   post:
 *     summary: Access Token frissítése Refresh Tokennel
 *     tags: [Public endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Refresh Token'
 *     responses:
 *       200:
 *         description: Sikeres accessToken frissítés.
 *         content:
 *              application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/Access Token new'
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *         content:
 *             application/json:
 *               example:
 *                  message: 'refreshToken required'
 *       403:
 *         description: Ha nem jó a refreshToken amit megadott(vagy lejárt)
 *         content:
 *            application/json:
 *               example:
 *                  message: 'jwt expired'
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *            application/json:
 *               example:
 *                  message: 'Cannot connect to the database'
 *
 *
 */