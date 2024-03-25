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
 *                      $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: akkor megvan a cikk és vissza is adjuk
 *       204:
 *         description: Ha nincs meg a cikk
 *       400:
 *         description: Ha nem jó a body amit kaptunk
 *       403:
 *         description: Ha nem jó az accessToken-ünk
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 */