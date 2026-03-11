import Article from '../../models/article.model';
import mongoose from 'mongoose';

describe('Article Model Test', () => {
  it('should create & save article successfully', async () => {
    const validArticle = new Article({
      title: 'Delicious Food of Aurangabad',
      slug: 'delicious-food-aurangabad',
      excerpt: 'Short summary',
      content: 'Content about food...',
      image: 'food.jpg',
      author: new mongoose.Types.ObjectId(),
      category: 'Guides',
      publishedDate: new Date(),
      readTime: 5,
      featured: true,
    });
    const savedArticle = await validArticle.save();

    expect(savedArticle._id).toBeDefined();
    expect(savedArticle.title).toBe(validArticle.title);
    expect(savedArticle.slug).toBe(validArticle.slug);
    expect(savedArticle.featured).toBe(true);
  });

  it('should fail validation without required field', async () => {
    const articleWithoutTitle = new Article({
      slug: 'no-title',
      content: 'Content...',
    });
    let err;
    try {
      await articleWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});
