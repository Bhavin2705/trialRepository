/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';

import { generateToken, verifyToken, generateRefreshToken, verifyRefreshToken, extractTokenFromHeader } from '../jwt';

describe('JWT utils', () => {
  test('generateToken and verifyToken - roundtrip', () => {
    const token = generateToken({ userId: '123', email: 'a@b.com' });
    expect(typeof token).toBe('string');

    const decoded: any = verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded.userId).toBe('123');
    expect(decoded.email).toBe('a@b.com');
  });

  test('verifyToken returns null for invalid token', () => {
    const decoded = verifyToken('bad.token.value');
    expect(decoded).toBeNull();
  });

  test('refresh token helpers', () => {
    const r = generateRefreshToken({ userId: 'r1' });
    expect(typeof r).toBe('string');
    const decoded: any = verifyRefreshToken(r);
    expect(decoded.userId).toBe('r1');
  });

  test('extractTokenFromHeader', () => {
    expect(extractTokenFromHeader(undefined)).toBeNull();
    expect(extractTokenFromHeader('Bearer abc.def')).toBe('abc.def');
    expect(extractTokenFromHeader('Token abc')).toBeNull();
  });
});
