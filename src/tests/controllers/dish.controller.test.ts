import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

describe('Dish Controller Integration', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Re-use user creation logic or create helpers in future
    // For now independent tests are safer
    const admin = new User({
      name: 'Admin Dish',
      email: 'admin_dish@example.com',
      password: 'password',
      userType: 'admin',
    });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, userType: admin.userType },
      process.env.JWT_SECRET || 'default_secret'
    );

    const customer = new User({
      name: 'Customer Dish',
      email: 'customer_dish@example.com',
      password: 'password',
      userType: 'customer',
    });
    await customer.save();
    userToken = jwt.sign(
      { id: customer._id, userType: customer.userType },
      process.env.JWT_SECRET || 'default_secret'
    );
  });

  describe('POST /v1/dishes', () => {
    it('should allow admin to create dish', async () => {
      const res = await request(app)
        .post('/v1/dishes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Biryani',
          image: 'biryani.jpg',
          category: 'Main Course',
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Biryani');
    });
  });

  describe('GET /v1/dishes', () => {
    it('should list dishes', async () => {
      const res = await request(app).get('/v1/dishes').set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });
  });
});
