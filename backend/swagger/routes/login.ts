/**
 * @swagger
 *
 *
 *
 * /user/login:
 *   post:
 *     summary: Bejelentkezés
 *     tags: [Public endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Sikeres bejelentkezés.
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *       401:
 *         description: Hibás név vagy jelszó
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *
 *
 */