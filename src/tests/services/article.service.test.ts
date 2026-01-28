import ArticleService from '../../services/article.service';
import Article from '../../models/article.model';

// Mocking the model
jest.mock('../../models/article.model');

describe('ArticleService', () => {
  let articleService: ArticleService;

  beforeEach(() => {
    articleService = new ArticleService();
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('should create an article', async () => {
      const mockArticleData = { title: 'Test Article' };
      const mockSavedArticle = { _id: '123', ...mockArticleData };

      // Mock the constructor and save method
      const mockSave = jest.fn().mockResolvedValue(mockSavedArticle);
      (Article as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await articleService.createArticle(mockArticleData as any);

      expect(Article).toHaveBeenCalledWith(mockArticleData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedArticle);
    });
  });

  describe('getAllArticles', () => {
    it('should return all articles', async () => {
      const mockArticles = [{ title: 'Article 1' }, { title: 'Article 2' }];
      (Article.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockArticles),
      });

      const result = await articleService.getAllArticles();

      expect(Article.find).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });
  });

  describe('getArticleById', () => {
    it('should return an article by id', async () => {
      const mockArticle = { _id: '123', title: 'Article 1' };
      (Article.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockArticle),
      });

      const result = await articleService.getArticleById('123');

      expect(Article.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockArticle);
    });
  });
});
