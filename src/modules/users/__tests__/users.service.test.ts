/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';

import UsersService from '../users.service';
import UsersRepository from '../users.repo';
import AuthRepository from '../../auth/auth.repo';
import * as passwordUtils from '../../../shared/utils/password';

describe('UsersService', () => {
  afterEach(() => jest.restoreAllMocks());

  test('getUserProfile not found', async () => {
    jest.spyOn(UsersRepository, 'findById').mockResolvedValue(null as any);
    const res = await UsersService.getUserProfile('nope');
    expect(res.success).toBe(false);
    expect(res.error).toBe('USER_NOT_FOUND');
  });

  test('getUserProfile success', async () => {
    const now = new Date();
    jest.spyOn(UsersRepository, 'findById').mockResolvedValue({ _id: 'u1', email: 'a@b.com', displayName: 'D', avatar: null, isEmailVerified: true, createdAt: now, updatedAt: now } as any);
    const res = await UsersService.getUserProfile('u1');
    expect(res.success).toBe(true);
    expect(res.user.email).toBe('a@b.com');
  });

  test('changePassword flow - not found / invalid / success', async () => {
    jest.spyOn(AuthRepository, 'findUserById').mockResolvedValue(null as any);
    let out = await UsersService.changePassword('u1', 'cur', 'newp');
    expect(out.success).toBe(false);

    jest.spyOn(AuthRepository, 'findUserById').mockResolvedValue({ _id: 'u1', password: 'h' } as any);
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(false);
    out = await UsersService.changePassword('u1', 'wrong', 'newp');
    expect(out.success).toBe(false);

    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(UsersRepository, 'updatePassword').mockResolvedValue(true as any);
    out = await UsersService.changePassword('u1', 'cur', 'newp');
    expect(out.success).toBe(true);
  });

  test('deleteUser flow', async () => {
    jest.spyOn(UsersRepository, 'deleteById').mockResolvedValue(false as any);
    let out = await UsersService.deleteUser('u1');
    expect(out.success).toBe(false);

    jest.spyOn(UsersRepository, 'deleteById').mockResolvedValue(true as any);
    out = await UsersService.deleteUser('u1');
    expect(out.success).toBe(true);
  });
});
