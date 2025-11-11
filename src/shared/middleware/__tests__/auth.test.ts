/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';

import { authenticate } from '../auth';
import * as jwtUtils from '../../utils/jwt';

describe('authenticate middleware', () => {
  test('responds 401 when no token provided', () => {
    const req: any = { headers: {} };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };
    const next = jest.fn();

    authenticate(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  test('responds 401 when token invalid', () => {
    const req: any = { headers: { authorization: 'Bearer bad' }, cookies: {} };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };
    const next = jest.fn();

    jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue(null as any);

    authenticate(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next and attaches user when token valid', () => {
    const req: any = { headers: { authorization: 'Bearer good' }, cookies: {} };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res: any = { status };
    const next = jest.fn();

    jest.spyOn(jwtUtils, 'verifyToken').mockReturnValue({ userId: 'u1', email: 'x@y.com' } as any);

    authenticate(req, res, next);

    expect((req as any).user).toEqual({ id: 'u1', email: 'x@y.com' });
    expect(next).toHaveBeenCalled();
  });
});
