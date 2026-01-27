import User, { IUser } from '../../models/user.model';
import bcrypt from 'bcrypt';

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      userType: 'customer',
    });
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe('john@example.com');
  });

  it('should hash the password before saving', async () => {
    const password = 'secretpassword';
    const user = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: password,
      userType: 'admin',
    });
    const savedUser = await user.save();

    expect(savedUser.password).not.toBe(password);
    const isMatch = await bcrypt.compare(password, savedUser.password);
    expect(isMatch).toBe(true);
  });

  it('should fail to create user with duplicate email', async () => {
    const email = 'duplicate@example.com';
    const user1 = new User({
      name: 'User 1',
      email: email,
      password: 'p1',
      userType: 'customer',
    });
    await user1.save();

    const user2 = new User({
      name: 'User 2',
      email: email,
      password: 'p2',
      userType: 'customer',
    });

    let err: any;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    // Mongoose duplicate key error code is 11000
    expect(err).toBeDefined();
    expect(err.code).toBe(11000);
  });
});
