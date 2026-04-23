import { Router } from 'express';
import multer from 'multer';
import galleryController from '../../controllers/gallery.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit 
});

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Website gallery management
 */

/**
 * @swagger
 * /v1/gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: List of gallery items
 */
router.get('/', galleryController.getAllItems);

/**
 * @swagger
 * /v1/gallery:
 *   post:
 *     summary: Upload a new gallery item
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Item uploaded
 */
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('image'),
  galleryController.uploadItem
);

/**
 * @swagger
 * /v1/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery item
 *     tags: [Gallery]
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
 *         description: Item deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), galleryController.deleteItem);

export default router;
