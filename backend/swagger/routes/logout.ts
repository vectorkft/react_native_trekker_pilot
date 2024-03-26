/**
 * @swagger
 *
 * /protected/user/logout:
 *   get:
 *     security:
 *        - bearerAuth: []
 *     summary: Kijelentkezés
 *     tags: [Protected Endpoints]
 *     responses:
 *       200:
 *         description: Sikeres kijelentkezés.
 *       403:
 *         description: Ha nem jó az accessToken
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 */