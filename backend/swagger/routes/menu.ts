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
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Menu Output'
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *         content:
 *           application/json:
 *             example:
 *               message: 'id - Required'
 *       403:
 *         description: Ha nem jó a refreshToken amit megadott(vagy lejárt)
 *         content:
 *           application/json:
 *             example:
 *               Forbidden
 *       404:
 *         description: Ha nem létezik a menu elem
 *         content:
 *           application/json:
 *             example:
 *               message: 'The menu with id: polc_valasztas1 not found.'
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *           application/json:
 *             example:
 *               message: 'Cannot connect to the database'
 *
 *
 */