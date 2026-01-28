import request from 'supertest';
import app from '../../app';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';

describe('Event Controller Integration', () => {
  let adminToken: string;

  beforeAll(async () => {
    const admin = new User({
      name: 'Admin Event',
      email: 'admin_event@example.com',
      password: 'password',
      userType: 'admin',
    });
    await admin.save();
    adminToken = jwt.sign(
      { id: admin._id, userType: admin.userType },
      process.env.JWT_SECRET || 'default_secret'
    );
  });

  it('should create event', async () => {
    const res = await request(app)
      .post('/v1/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Event 1',
        description: 'Desc',
        date: new Date(),
        location: 'Loc',
        image: 'img.jpg',
        organizer: 'Org',
        price: '0',
        capacity: 100,
      });

    expect(res.status).toBe(201);
  });
});
