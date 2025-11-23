import { checkRateLimit } from '../rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear rate limiter cache before each test
    jest.clearAllMocks();
  });

  it('should allow requests within limit', () => {
    const identifier = 'test-user-1';
    const limit = 5;

    for (let i = 0; i < limit; i++) {
      const result = checkRateLimit(identifier, limit);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(limit - i - 1);
    }
  });

  it('should block requests exceeding limit', () => {
    const identifier = 'test-user-2';
    const limit = 3;

    // Use up the limit
    for (let i = 0; i < limit; i++) {
      checkRateLimit(identifier, limit);
    }

    // Next request should be blocked
    const result = checkRateLimit(identifier, limit);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should track different identifiers separately', () => {
    const limit = 5;

    const result1 = checkRateLimit('user-1', limit);
    const result2 = checkRateLimit('user-2', limit);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.remaining).toBe(limit - 1);
    expect(result2.remaining).toBe(limit - 1);
  });

  it('should use default limit if not specified', () => {
    const identifier = 'test-user-3';
    const result = checkRateLimit(identifier);

    expect(result.success).toBe(true);
    expect(typeof result.remaining).toBe('number');
  });
});
