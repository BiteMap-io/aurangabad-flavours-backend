import { Router } from 'express';
import articleController from '../../controllers/article.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

// Retrieve all articles - Authenticated users
router.get('/', authenticate, articleController.getAllArticles);

// Retrieve a single article - Authenticated users
router.get('/:id', authenticate, articleController.getArticleById);

// Create a new article - Admin only
router.post('/', authenticate, authorize(['admin']), articleController.createArticle);

// Update an article - Admin only
router.put('/:id', authenticate, authorize(['admin']), articleController.updateArticle);

// Delete an article - Admin only
router.delete('/:id', authenticate, authorize(['admin']), articleController.deleteArticle);

export default router;
