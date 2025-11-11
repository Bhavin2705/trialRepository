/// <reference types="jest" />
import PaginationHelper from '../pagination';

describe('PaginationHelper', () => {
  test('buildQuery defaults and bounds', () => {
    const q = PaginationHelper.buildQuery({});
    expect(q.page).toBe(1);
    expect(q.limit).toBe(10);
    expect(q.skip).toBe(0);
    expect(q.sort).toHaveProperty('createdAt');
  });

  test('buildQuery with custom values', () => {
    const q = PaginationHelper.buildQuery({ page: 3, limit: 20, sort: 'name', order: 'asc' });
    expect(q.page).toBe(3);
    expect(q.limit).toBe(20);
    expect(q.skip).toBe(40);
    expect(q.sort).toHaveProperty('name', 1);
  });

  test('buildResponse pagination calculations', () => {
    const data = ['a', 'b'];
    const res = PaginationHelper.buildResponse(data, 50, 2, 10);
    expect(res.data).toEqual(data);
    expect(res.pagination.page).toBe(2);
    expect(res.pagination.pages).toBe(5);
    expect(res.pagination.hasNext).toBe(true);
    expect(res.pagination.hasPrev).toBe(true);
  });
});
