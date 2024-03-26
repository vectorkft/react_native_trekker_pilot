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
 *       403:
 *         description: Forbidden ha nem szupi az accessToken
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 */