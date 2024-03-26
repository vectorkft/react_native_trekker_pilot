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
 *         content:
 *           application/json:
 *             example:
 *               Logout successful
 *
 *       403:
 *         description: Ha nem jó az accessToken
 *         content:
 *           application/json:
 *             example:
 *               'Forbidden'
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *           application/json:
 *             example:
 *               message: 'Cannot connect to the database'
 *
 */