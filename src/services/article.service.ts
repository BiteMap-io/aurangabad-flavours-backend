import Article, { IArticle } from '../models/article.model';

/**
 * @author Denizuh
 * @description Service for article-related operations
 * @date 2026-01-27
 *
 * @notes
 * - This service provides functions to interact with article data in the database.
 * - It includes methods for creating, retrieving, updating, and deleting articles.
 */
class ArticleService {
  /**
   * Create a new article
   * @param articleData - Data for the new article
   * @returns The created article document
   */
  async createArticle(articleData: Partial<IArticle>): Promise<IArticle> {
    const newArticle = new Article(articleData);
    return newArticle.save();
  }

  /**
   * Get an article by ID
   * @param articleId - The ID of the article to retrieve
   * @returns The article document or null if not found
   */
  async getArticleById(articleId: string): Promise<IArticle | null> {
    return Article.findById(articleId).populate('author').exec();
  }

  /**
   * Get all articles
   * @returns List of all articles
   */
  async getAllArticles(): Promise<IArticle[]> {
    return Article.find().populate('author').exec();
  }

  /**
   * Update an article by ID
   * @param articleId - The ID of the article to update
   * @param updateData - Data to update the article with
   * @returns The updated article document or null if not found
   */
  async updateArticle(articleId: string, updateData: Partial<IArticle>): Promise<IArticle | null> {
    return Article.findByIdAndUpdate(articleId, updateData, { new: true }).exec();
  }

  /**
   * Delete an article by ID
   * @param articleId - The ID of the article to delete
   * @returns The deleted article document or null if not found
   */
  async deleteArticle(articleId: string): Promise<IArticle | null> {
    return Article.findByIdAndDelete(articleId).exec();
  }
}

export default ArticleService;
