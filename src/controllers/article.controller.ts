import { Request, Response } from 'express';
import ArticleService from '../services/article.service';
import { AuthRequest } from '../middleware/auth.middleware';
import s3Service from '../services/s3.service';

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const decodeBase64 = (base64String: string) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches && matches.length === 3) {
    return {
      type: matches[1],
      buffer: Buffer.from(matches[2], 'base64'),
    };
  }
  try {
    const buffer = Buffer.from(base64String.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
    return { type: 'image/png', buffer };
  } catch (e) {
    return null;
  }
};

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
   */
  createArticle = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const articleTitle = req.body.title || 'article';
      const folder = slugify(articleTitle);

      if (req.file) {
        const f = req.file;
        const key = `articles/${folder}/${Date.now()}-${f.originalname}`;
        const { url } = await s3Service.uploadBuffer(key, f.buffer, f.mimetype);
        req.body.image = url;
        console.log(`successfully stored that mf (article): ${url}`);
      } else if (typeof req.body.image === 'string' && (req.body.image.startsWith('data:image/') || req.body.image.length > 500)) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const extension = decoded.type.split('/')[1] || 'png';
          const key = `articles/${folder}/${Date.now()}-image.${extension}`;
          const { url } = await s3Service.uploadBuffer(key, decoded.buffer, decoded.type);
          req.body.image = url;
          console.log(`successfully stored that mf (article base64): ${url}`);
        }
      }

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
   */
  updateArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const articleTitle = req.body.title || 'updated-article';
      const folder = slugify(articleTitle);

      if (req.file) {
        const f = req.file;
        const key = `articles/${folder}/${Date.now()}-${f.originalname}`;
        const { url } = await s3Service.uploadBuffer(key, f.buffer, f.mimetype);
        req.body.image = url;
        console.log(`successfully stored that mf (update article): ${url}`);
      } else if (typeof req.body.image === 'string' && req.body.image.startsWith('data:image/')) {
        const decoded = decodeBase64(req.body.image);
        if (decoded) {
          const extension = decoded.type.split('/')[1] || 'png';
          const key = `articles/${folder}/${Date.now()}-image.${extension}`;
          const { url } = await s3Service.uploadBuffer(key, decoded.buffer, decoded.type);
          req.body.image = url;
          console.log(`successfully stored that mf (update article base64): ${url}`);
        }
      }

      const article = await this.articleService.updateArticle(req.params.id, req.body);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Failed to update article' });
    }
  };

  /**
   * Handle deleting an article by ID
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
