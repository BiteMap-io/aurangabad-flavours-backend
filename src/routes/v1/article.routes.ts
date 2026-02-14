import { Router } from 'express';
import articleController from '../../controllers/article.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management
 */

/**
 * @swagger
 * /v1/articles:
 *   get:
 *     summary: Get all articles (Public)
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /v1/articles/{id}:
 *   get:
 *     summary: Get article by ID (Public)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /v1/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, content, author, excerpt, image, publishedDate, readTime]
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *                 description: User ID
 *               excerpt:
 *                 type: string
 *               image:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date-time
 *               readTime:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Article created
 */
router.post('/', authenticate, authorize(['admin']), articleController.createArticle);

/**
 * @swagger
 * /v1/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               image:
 *                 type: string
 *               featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Article updated
 */
router.put('/:id', authenticate, authorize(['admin']), articleController.updateArticle);

/**
 * @swagger
 * /v1/articles/{id}:
 *   delete:
 *     summary: Delete an article
 *     tags: [Articles]
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
 *         description: Article deleted
 */
router.delete('/:id', authenticate, authorize(['admin']), articleController.deleteArticle);

/**
 * @swagger
 * /v1/articles/{id}/toggle-status:
 *   patch:
 *     summary: Toggle article status (Admin)
 *     tags: [Articles]
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
 *         description: Status toggled
 */
router.patch(
  '/:id/toggle-status',
  authenticate,
  authorize(['admin']),
  articleController.toggleStatus
);

export default router;
