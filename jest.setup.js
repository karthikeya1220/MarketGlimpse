// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.BETTER_AUTH_URL = 'http://localhost:3000';
process.env.FINNHUB_API_KEY = 'test-api-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.NODEMAILER_EMAIL = 'test@example.com';
process.env.NODEMAILER_PASSWORD = 'test-password';
