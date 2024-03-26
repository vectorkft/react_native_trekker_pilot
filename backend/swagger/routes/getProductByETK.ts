/**
 * @swagger
 *
 * /protected/product/getCikk:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Cikk lekérdezése ETK vagy EAN alapján
 *     tags: [Protected Endpoints]
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product Input'
 *     responses:
 *       200:
 *         description: akkor megvan a cikk és vissza is adjuk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product Output'
 *
 *       204:
 *         description: Ha nincs meg a cikk
 *       400:
 *         description: Ha nem jó a body amit kaptunk
 *         content:
 *            application/json:
 *               example:
 *                   message: 'value - Nem valid EAN kód!'
 *       403:
 *         description: Ha nem jó az accessToken-ünk
 *         content:
 *           application/json:
 *             example:
 *               Forbidden
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *            application/json:
 *               example:
 *                  message: 'Cannot connect to the database'
 *
 */