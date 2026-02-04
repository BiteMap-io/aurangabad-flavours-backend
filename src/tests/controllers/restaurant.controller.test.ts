import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';

describe('Restaurant Controller Integration', () => {
  let adminToken: string;

  beforeAll(async () => {
    const admin = new User({
      name: 'Admin Rest',
      email: 'admin_rest@example.com',
      password: 'password',
      userType: 'admin',
    });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, userType: admin.userType },
      process.env.JWT_SECRET || 'default_secret'
    );
  });

  it('should create restaurant', async () => {
    const res = await request(app)
      .post('/v1/restaurants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Rest 1',
        estabilishmentType: 'Type 1',
        priceRange: '$$',
        rating: 5,
        image: 'img.jpg',
        gallery: [],
        description: 'Desc',
        location: {
          type: 'Point',
          coordinates: [0, 0],
          address: 'Addr',
        },
        verified: true,
        ihmRecommended: true,
        area: 'Area',
      });

    expect(res.status).toBe(201);
  });

  describe('GET /v1/restaurants', () => {
    it('should allow public access to list restaurants', async () => {
      const res = await request(app).get('/v1/restaurants');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
