import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';

describe('FoodTrail Controller Integration', () => {
  let adminToken: string;

  beforeAll(async () => {
    const admin = new User({
      name: 'Admin Trail',
      email: 'admin_trail@example.com',
      password: 'password',
      userType: 'admin',
    });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, userType: admin.userType },
      process.env.JWT_SECRET || 'default_secret'
    );
  });

  it('should create food trail', async () => {
    const res = await request(app)
      .post('/v1/food-trails')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Trail 1',
        icon: 'icon',
        color: 'blue',
      });

    expect(res.status).toBe(201);
  });
});
