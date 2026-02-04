import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Article Controller Integration', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Create Admin
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password',
      userType: 'admin',
    });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, userType: admin.userType },
      process.env.JWT_SECRET || 'default_secret'
    );

    // Create Customer
    const customer = new User({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password',
      userType: 'customer',
    });
    await customer.save();
    userToken = jwt.sign(
      { id: customer._id, userType: customer.userType },
      process.env.JWT_SECRET || 'default_secret'
    );
  });

  describe('POST /v1/articles', () => {
    it('should allow admin to create article', async () => {
      const res = await request(app)
        .post('/v1/articles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Article',
          slug: 'new-article',
          excerpt: 'Short excerpt',
          content: 'Content...',
          image: 'img.jpg',
          author: new mongoose.Types.ObjectId(),
          publishedDate: new Date(),
          readTime: '5 mins',
          featured: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Article');
    });

    it('should deny customer to create article', async () => {
      const res = await request(app)
        .post('/v1/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Hacked Article',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /v1/articles', () => {
    it('should allow public (unauthenticated) access to list articles', async () => {
      const res = await request(app).get('/v1/articles');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
