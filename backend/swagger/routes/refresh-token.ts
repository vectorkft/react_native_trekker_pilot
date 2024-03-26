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
 *         description: Sikeres bejelentkezés.
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *       403:
 *         description: Ha nem jó a refreshToken amit megadott(vagy lejárt)
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 *
 */