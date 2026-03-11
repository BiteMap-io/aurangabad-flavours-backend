import { Router } from 'express';
import settingsController from '../../controllers/settings.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Application settings management
 */

/**
 * @swagger
 * /v1/settings:
 *   get:
 *     summary: Get application settings (Public)
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Application settings
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /v1/settings:
 *   put:
 *     summary: Update application settings (Admin)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.put('/', authenticate, authorize(['admin']), settingsController.updateSettings);

export default router;
