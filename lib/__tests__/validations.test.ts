import { z } from 'zod';
import { signUpSchema, signInSchema } from '../validations/auth';

describe('Auth Validations - signUpSchema', () => {
  it('should validate correct signup data', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      country: 'US',
      investmentGoals: 'Long-term growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Technology',
    };

    expect(() => signUpSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'not-an-email',
      password: 'SecurePass123!',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject short password', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Short1',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject password without uppercase', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'lowercase123',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject password without lowercase', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'UPPERCASE123',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject password without numbers', () => {
    const invalidData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'NoNumbersHere',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject empty full name', () => {
    const invalidData = {
      fullName: '',
      email: 'john@example.com',
      password: 'SecurePass123!',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    expect(() => signUpSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should trim whitespace from inputs', () => {
    const dataWithSpaces = {
      fullName: '  John Doe  ',
      email: '  john@example.com  ',
      password: 'SecurePass123!',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Moderate',
      preferredIndustry: 'Tech',
    };

    const result = signUpSchema.parse(dataWithSpaces);
    expect(result.fullName).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });
});

describe('Auth Validations - signInSchema', () => {
  it('should validate correct signin data', () => {
    const validData = {
      email: 'john@example.com',
      password: 'SecurePass123!',
    };

    expect(() => signInSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'SecurePass123!',
    };

    expect(() => signInSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should reject empty password', () => {
    const invalidData = {
      email: 'john@example.com',
      password: '',
    };

    expect(() => signInSchema.parse(invalidData)).toThrow(z.ZodError);
  });

  it('should trim email whitespace', () => {
    const dataWithSpaces = {
      email: '  john@example.com  ',
      password: 'SecurePass123!',
    };

    const result = signInSchema.parse(dataWithSpaces);
    expect(result.email).toBe('john@example.com');
  });
});
