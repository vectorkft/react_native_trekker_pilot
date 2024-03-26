/**
 * @swagger
 *
 *
 *
 * /protected/menu:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: Menu
 *     tags: [Protected Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Ha megvan a menu elem.
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *       403:
 *         description: Ha nem jó a refreshToken amit megadott(vagy lejárt)
 *       404:
 *         description: Ha nem létezik a menu elem
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 *
 */