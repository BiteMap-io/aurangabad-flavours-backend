import request from 'supertest';
import app from '../../app';

describe('User Controller Integration', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/v1/auth/signup').send({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      userType: 'customer',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('newuser@example.com');
  });

  it('should login an existing user', async () => {
    // First register
    await request(app).post('/v1/auth/signup').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    });

    // Then login
    const res = await request(app).post('/v1/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
