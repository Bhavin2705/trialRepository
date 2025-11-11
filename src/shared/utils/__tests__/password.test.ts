/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';

jest.setTimeout(30000);

import { hashPassword, comparePassword, generateResetToken, generateVerificationToken, validatePasswordStrength } from '../password';

describe('Password utils', () => {
  test('hash and compare password', async () => {
    const raw = 'P@ssw0rd!';
    const hashed = await hashPassword(raw);
    expect(typeof hashed).toBe('string');
    const ok = await comparePassword(raw, hashed);
    expect(ok).toBe(true);
    const bad = await comparePassword('wrong', hashed);
    expect(bad).toBe(false);
  });

  test('generate tokens produce strings of expected length', () => {
    const r = generateResetToken();
    const v = generateVerificationToken();
    expect(typeof r).toBe('string');
    expect(typeof v).toBe('string');
    expect(r.length).toBeGreaterThanOrEqual(32);
    expect(v.length).toBeGreaterThanOrEqual(32);
  });

  test('validatePasswordStrength edge cases', () => {
    expect(validatePasswordStrength('short').isValid).toBe(false);
    expect(validatePasswordStrength('alllowercase1!').isValid).toBe(false);
    expect(validatePasswordStrength('ALLUPPER1!').isValid).toBe(false);
    expect(validatePasswordStrength('NoNumber!').isValid).toBe(false);
    expect(validatePasswordStrength('NoSpecial1').isValid).toBe(false);
    expect(validatePasswordStrength('Good1Pass!').isValid).toBe(true);
  });
});
