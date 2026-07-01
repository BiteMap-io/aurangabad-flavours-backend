import { Router } from 'express';
import shareController from '../../controllers/share.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Share
 *   description: Server-rendered Open Graph share pages
 */

/**
 * @swagger
 * /v1/share/restaurant/{id}:
 *   get:
 *     summary: Server-rendered OG preview page for a restaurant, redirects real visitors into the SPA
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HTML page with Open Graph tags
 */
router.get('/restaurant/:id', shareController.restaurantCard);

export default router;
