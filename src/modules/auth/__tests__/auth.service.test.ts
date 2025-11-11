/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';

import AuthService from '../auth.service';
import AuthRepository from '../auth.repo';
import * as jwtUtils from '../../../shared/utils/jwt';
import * as passwordUtils from '../../../shared/utils/password';

describe('AuthService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('registerUser throws when user exists', async () => {
    jest.spyOn(AuthRepository, 'findUserByEmail').mockResolvedValue({} as any);

    await expect(AuthService.registerUser({ email: 'x@y.com', password: 'p', displayName: 'D' })).rejects.toThrow();
  });

  test('registerUser returns token and user on success', async () => {
    jest.spyOn(AuthRepository, 'findUserByEmail').mockResolvedValue(null as any);
    jest.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashed');
    jest.spyOn(AuthRepository, 'createUser').mockResolvedValue({ _id: 'id1', email: 'x@y.com', displayName: 'D', isEmailVerified: false } as any);
    jest.spyOn(jwtUtils, 'generateToken').mockReturnValue('tok');

    const res = await AuthService.registerUser({ email: 'x@y.com', password: 'p', displayName: 'D' });
    expect(res.token).toBe('tok');
    expect(res.user.email).toBe('x@y.com');
  });

  test('loginUser throws when user not found or invalid password', async () => {
    jest.spyOn(AuthRepository, 'findUserByEmail').mockResolvedValue(null as any);
    await expect(AuthService.loginUser({ email: 'a', password: 'b' })).rejects.toThrow('Invalid email or password');

    jest.spyOn(AuthRepository, 'findUserByEmail').mockResolvedValue({ password: 'h' } as any);
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(false);
    await expect(AuthService.loginUser({ email: 'a', password: 'b' })).rejects.toThrow('Invalid email or password');
  });

  test('loginUser returns token and user on success', async () => {
    jest.spyOn(AuthRepository, 'findUserByEmail').mockResolvedValue({ _id: 'u1', email: 'x@y.com', displayName: 'D', password: 'h', isEmailVerified: true } as any);
    jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(jwtUtils, 'generateToken').mockReturnValue('token');

    const res = await AuthService.loginUser({ email: 'x@y.com', password: 'p' });
    expect(res.token).toBe('token');
    expect(res.user.email).toBe('x@y.com');
  });

  test('refreshUserToken validations and success', async () => {
    await expect(AuthService.refreshUserToken('')).rejects.toThrow('Refresh token required');

    jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue(null as any);
    await expect(AuthService.refreshUserToken('bad')).rejects.toThrow('Invalid refresh token');

    jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue({ userId: 'u1' } as any);
    jest.spyOn(AuthRepository, 'findUserById').mockResolvedValue({ _id: 'u1', email: 'x@y.com' } as any);
    jest.spyOn(jwtUtils, 'generateToken').mockReturnValue('newtok');

    const out = await AuthService.refreshUserToken('good');
    expect(out.token).toBe('newtok');
  });
});
