import { Router } from 'express';
import adminController from '../../controllers/admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard operations
 */

/**
 * @swagger
 * /v1/admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/stats', authenticate, authorize(['admin']), adminController.getStats);

/**
 * @swagger
 * /v1/admin/recent-activity:
 *   get:
 *     summary: Get recent activity log (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activity log
 */
router.get(
  '/recent-activity',
  authenticate,
  authorize(['admin']),
  adminController.getRecentActivity
);

export default router;
