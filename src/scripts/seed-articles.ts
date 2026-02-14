import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Article from '../models/article.model';
import User from '../models/user.model';
import config from '../config';

const sampleArticles = [
  {
    title: '10 Must-Try Street Foods in Aurangabad',
    slug: '10-must-try-street-foods-aurangabad',
    excerpt: 'From Naan Qalia to Tahri, explore the rich culinary heritage of the city of gates.',
    content:
      "Aurangabad is not just about Ellora and Ajanta; it's a paradise for food lovers. The city's street food is a blend of Mughlai and local Maharashtrian flavors...",
    image: 'https://images.unsplash.com/photo-1589187151003-0dd55769239b',
    category: 'Food Guides',
    tags: ['Street Food', 'Aurangabad', 'Delicacies'],
    status: 'published',
    publishedDate: new Date(),
    readTime: '5 min',
    featured: true,
  },
  {
    title: 'The Legend of Naan Qalia',
    slug: 'legend-of-naan-qalia',
    excerpt: "Discover the history behind Aurangabad's most famous dish.",
    content:
      "Naan Qalia is more than just food; it's a historical legacy dating back to the era of Aurangzeb. Prepared with a unique blend of spices...",
    image: 'https://images.unsplash.com/photo-1601050633647-8f8f5f4ad473',
    category: 'History',
    tags: ['Naan Qalia', 'History', 'Tradition'],
    status: 'published',
    publishedDate: new Date(),
    readTime: '8 min',
    featured: true,
  },
  {
    title: 'Best Fine Dining Places for a Royal Experience',
    slug: 'best-fine-dining-aurangabad',
    excerpt: 'Looking for a premium dinner? Here are some top picks.',
    content:
      'If you want to experience the royal hospitality of Aurangabad, these fine dining restaurants offer an exquisite ambiance and authentic taste...',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
    category: 'Restaurants',
    tags: ['Fine Dining', 'Luxury', 'Royal'],
    status: 'published',
    publishedDate: new Date(),
    readTime: '6 min',
    featured: false,
  },
];

async function seedArticles() {
  try {
    console.log('Connecting to MongoDB for article seeding...');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected.');

    const admin = await User.findOne({ userType: 'admin' });
    if (!admin) {
      console.error('No admin user found. Please run seed script first.');
      process.exit(1);
    }

    console.log('Clearing existing articles...');
    await Article.deleteMany({});

    console.log(`Seeding ${sampleArticles.length} articles...`);
    const articlesWithAuthor = sampleArticles.map((article) => ({
      ...article,
      author: admin._id,
    }));

    await Article.insertMany(articlesWithAuthor);

    console.log('Article seeding completed successfully.');
    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    if (require.main === module) process.exit(1);
  }
}

if (require.main === module) {
  seedArticles();
}

export default seedArticles;
