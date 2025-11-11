/// <reference types="jest" />
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'testsecret';
process.env.OPENROUTER_API_KEY = 'testkey';
process.env.NODE_ENV = 'test';

import request from 'supertest';
import app from '../app';

describe('Express app', () => {
  test('/health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('environment', process.env.NODE_ENV);
  });

  test('unknown route returns 404 with message', async () => {
    const res = await request(app).get('/not-a-route');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toMatch(/Route/);
  });
});
