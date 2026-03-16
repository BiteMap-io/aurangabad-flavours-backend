import { Request, Response } from 'express';
import ArticleService from '../services/article.service';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * @author Denizuh
 * @description Controller for article-related operations
 * @date 2026-01-27
 */
class ArticleController {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  /**
   * Handle creating a new article
   * @param req - Express request object
   * @param res - Express response object
   */
  createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const articleData = {
        ...req.body,
        author: req.body.author || req.user?._id
      };
      const article = await this.articleService.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Failed to create article' });
    }
  };

  /**
   * Handle retrieving an article by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  getArticleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const article = await this.articleService.getArticleById(req.params.id);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve article' });
    }
  };

  /**
   * Handle retrieving an article by Slug
   * @param req - Express request object
   * @param res - Express response object
   */
  getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const article = await this.articleService.getArticleBySlug(req.params.slug);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve article' });
    }
  };

  /**
   * Handle retrieving all articles
   * @param req - Express request object
   * @param res - Express response object
   */
  getAllArticles = async (req: Request, res: Response): Promise<void> => {
    try {
      const articles = await this.articleService.getAllArticles();
      res.status(200).json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve articles' });
    }
  };

  /**
   * Handle updating an article by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  updateArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const article = await this.articleService.updateArticle(req.params.id, req.body);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update article' });
    }
  };

  /**
   * Handle deleting an article by ID
   * @param req - Express request object
   * @param res - Express response object
   */
  deleteArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const article = await this.articleService.deleteArticle(req.params.id);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  };

  /**
   * Handle toggling article status
   * @param req - Express request object
   * @param res - Express response object
   */
  toggleStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const article = await this.articleService.getArticleById(req.params.id);
      if (!article) {
        res.status(404).json({ error: 'Article not found' });
        return;
      }

      article.status = article.status === 'published' ? 'draft' : 'published';
      await article.save();
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle article status' });
    }
  };
}

export default new ArticleController();
