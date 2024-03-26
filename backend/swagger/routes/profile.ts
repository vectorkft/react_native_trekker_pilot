/**
 * @swagger
 *
 * /protected/user/profile:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Profil
 *     tags: [Protected Endpoints]
 *     responses:
 *       200:
 *         description: ha szupi az accessToken
 *         content:
 *           application/json:
 *             example:
 *               OK
 *       403:
 *         description: Forbidden ha nem szupi az accessToken
 *         content:
 *           application/json:
 *             example:
 *                Forbidden
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *           application/json:
 *             example:
 *               message: 'Cannot connect to the database'
 *
 */