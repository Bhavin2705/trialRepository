/// <reference types="jest" />
import mongoose from 'mongoose';
import { User } from '../User';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/interview-mirror-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
  });

  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with required fields', async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'Password123!',
      displayName: 'Test User',
    });
    expect(user.email).toBe('test@example.com');
    expect(user.displayName).toBe('Test User');
    expect(user.isEmailVerified).toBe(false);
    expect(user.refreshTokens).toEqual([]);
  });

  it('should require email, password, and displayName', async () => {
    const user = new User();
    let err;
    try {
      await user.validate();
    } catch (e: any) {
      err = e;
    }
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.displayName).toBeDefined();
  });

  it('should enforce unique email', async () => {
    await User.create({
      email: 'unique@example.com',
      password: 'Password123!',
      displayName: 'User1',
    });
    let err;
    try {
      await User.create({
        email: 'unique@example.com',
        password: 'Password123!',
        displayName: 'User2',
      });
    } catch (e: any) {
      err = e;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  });

  it('should trim and lowercase email', async () => {
    const user = await User.create({
      email: '  TEST@EXAMPLE.COM  ',
      password: 'Password123!',
      displayName: 'Test User',
    });
    expect(user.email).toBe('test@example.com');
  });

  it('should set default values', async () => {
    const user = await User.create({
      email: 'defaults@example.com',
      password: 'Password123!',
      displayName: 'Defaults',
    });
    expect(user.avatar).toBeNull();
    expect(user.isEmailVerified).toBe(false);
    expect(user.refreshTokens).toEqual([]);
  });

  it('should allow optional fields', async () => {
    const user = await User.create({
      email: 'opt@example.com',
      password: 'Password123!',
      displayName: 'Opt',
      avatar: 'avatar.png',
      emailVerificationToken: 'token',
      passwordResetToken: 'reset',
      passwordResetExpires: new Date(),
      refreshTokens: ['token1'],
    });
    expect(user.avatar).toBe('avatar.png');
    expect(user.emailVerificationToken).toBe('token');
    expect(user.passwordResetToken).toBe('reset');
    expect(Array.isArray(user.refreshTokens)).toBe(true);
    expect(user.refreshTokens.length).toBe(1);
  });
});
