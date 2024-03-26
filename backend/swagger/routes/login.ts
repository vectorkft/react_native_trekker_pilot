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
 *             $ref: '#/components/schemas/User Input'
 *     responses:
 *       200:
 *         description: Sikeres bejelentkezés.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User Output'
 *
 *       400:
 *         description: Zod error, nem jó body-t kapott
 *         content:
 *              application/json:
 *                example:
 *                   message: 'name - Expected string, received number'
 *       401:
 *         description: Hibás név vagy jelszó
 *         content:
 *            application/json:
 *               example:
 *                  message: 'Invalid username or password'
 *       500:
 *         description: Nem megy az adatbázis vagy valami unexpected hiba jött
 *         content:
 *           application/json:
 *             example:
 *               message: 'Cannot connect to the database'
 *
 *
 */