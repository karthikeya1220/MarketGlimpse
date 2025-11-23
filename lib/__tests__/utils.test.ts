import {
  cn,
  formatTimeAgo,
  formatMarketCapValue,
  getDateRange,
  calculateNewsDistribution,
  formatPrice,
  formatChangePercent,
  getChangeColorClass,
} from '../utils';

describe('Utils - cn()', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).not.toContain('bar');
    expect(result).toContain('baz');
  });
});

describe('Utils - formatTimeAgo()', () => {
  it('should format minutes correctly', () => {
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 5 * 60;
    const result = formatTimeAgo(fiveMinutesAgo);
    expect(result).toBe('5 minutes ago');
  });

  it('should format hours correctly', () => {
    const twoHoursAgo = Math.floor(Date.now() / 1000) - 2 * 60 * 60;
    const result = formatTimeAgo(twoHoursAgo);
    expect(result).toBe('2 hours ago');
  });

  it('should format days correctly', () => {
    const threeDaysAgo = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
    const result = formatTimeAgo(threeDaysAgo);
    expect(result).toBe('3 days ago');
  });

  it('should handle singular forms', () => {
    const oneHourAgo = Math.floor(Date.now() / 1000) - 1 * 60 * 60;
    const result = formatTimeAgo(oneHourAgo);
    expect(result).toBe('1 hour ago');
  });
});

describe('Utils - formatMarketCapValue()', () => {
  it('should format trillions correctly', () => {
    expect(formatMarketCapValue(3.1e12)).toBe('$3.10T');
  });

  it('should format billions correctly', () => {
    expect(formatMarketCapValue(900e9)).toBe('$900.00B');
  });

  it('should format millions correctly', () => {
    expect(formatMarketCapValue(25e6)).toBe('$25.00M');
  });

  it('should handle small numbers', () => {
    expect(formatMarketCapValue(999999.99)).toBe('$999999.99');
  });

  it('should return N/A for invalid inputs', () => {
    expect(formatMarketCapValue(0)).toBe('N/A');
    expect(formatMarketCapValue(-100)).toBe('N/A');
    expect(formatMarketCapValue(NaN)).toBe('N/A');
  });
});

describe('Utils - getDateRange()', () => {
  it('should return correct date range', () => {
    const result = getDateRange(5);
    expect(result).toHaveProperty('from');
    expect(result).toHaveProperty('to');
    expect(typeof result.from).toBe('string');
    expect(typeof result.to).toBe('string');
    
    // Check format YYYY-MM-DD
    expect(result.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should calculate correct date difference', () => {
    const result = getDateRange(7);
    expect(result.from).toBeDefined();
    expect(result.to).toBeDefined();
    
    const fromDate = new Date(result.from!);
    const toDate = new Date(result.to!);
    const daysDiff = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    
    expect(daysDiff).toBe(7);
  });
});

describe('Utils - calculateNewsDistribution()', () => {
  it('should return 3 items per symbol for < 3 symbols', () => {
    const result = calculateNewsDistribution(2);
    expect(result.itemsPerSymbol).toBe(3);
    expect(result.targetNewsCount).toBe(6);
  });

  it('should return 2 items per symbol for exactly 3 symbols', () => {
    const result = calculateNewsDistribution(3);
    expect(result.itemsPerSymbol).toBe(2);
    expect(result.targetNewsCount).toBe(6);
  });

  it('should return 1 item per symbol for > 3 symbols', () => {
    const result = calculateNewsDistribution(10);
    expect(result.itemsPerSymbol).toBe(1);
    expect(result.targetNewsCount).toBe(6);
  });
});

describe('Utils - formatPrice()', () => {
  it('should format price with currency symbol', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should handle decimal places correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
    expect(formatPrice(0.5)).toBe('$0.50');
  });
});

describe('Utils - formatChangePercent()', () => {
  it('should format positive changes with + sign', () => {
    expect(formatChangePercent(5.25)).toBe('+5.25%');
  });

  it('should format negative changes without extra sign', () => {
    expect(formatChangePercent(-3.45)).toBe('-3.45%');
  });

  it('should return empty string for undefined', () => {
    expect(formatChangePercent(undefined)).toBe('');
  });

  it('should handle zero correctly', () => {
    expect(formatChangePercent(0)).toBe('');
  });
});

describe('Utils - getChangeColorClass()', () => {
  it('should return green for positive changes', () => {
    expect(getChangeColorClass(5.25)).toBe('text-green-500');
  });

  it('should return red for negative changes', () => {
    expect(getChangeColorClass(-3.45)).toBe('text-red-500');
  });

  it('should return gray for undefined', () => {
    expect(getChangeColorClass(undefined)).toBe('text-gray-400');
  });
});
