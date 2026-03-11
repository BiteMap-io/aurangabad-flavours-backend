import { Router } from 'express';
import multer from 'multer';
import mediaController from '../../controllers/media.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media management
 */

/**
 * @swagger
 * /v1/media:
 *   get:
 *     summary: Get all media records (Admin)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of media
 */
router.get('/', authenticate, authorize(['admin']), mediaController.getAllMedia);

/**
 * @swagger
 * /v1/media:
 *   post:
 *     summary: Upload media (Admin)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('file'),
  mediaController.uploadMedia
);

/**
 * @swagger
 * /v1/media/{id}:
 *   delete:
 *     summary: Delete media (Admin)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), mediaController.deleteMedia);

export default router;
