# Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js 16 App Router, React 19, TailwindCSS)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Middleware Layer                        │
│  • Rate Limiting                                             │
│  • Authentication (Better Auth)                              │
│  • Request Deduplication                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  • Server Actions                                            │
│  • API Routes                                                │
│  • Error Handling                                            │
│  • Validation (Zod)                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  External APIs   │  │    Database      │
        │  • Finnhub       │  │    MongoDB       │
        │  • Gemini AI     │  │    • Users       │
        │  • TradingView   │  │    • Watchlist   │
        │  • Nodemailer    │  │    • Sessions    │
        └──────────────────┘  └──────────────────┘
```

## 📁 Directory Structure

```
stock-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (root)/              # Protected routes (dashboard)
│   ├── api/                 # API routes
│   │   ├── health/         # Health check endpoint
│   │   └── inngest/        # Background job webhooks
│   ├── error.tsx           # Error boundary for routes
│   ├── global-error.tsx    # Global error handler
│   └── layout.tsx          # Root layout
│
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── forms/              # Form components
│   ├── ErrorBoundary.tsx   # Client-side error boundary
│   └── ...                 # Feature components
│
├── lib/                    # Core business logic
│   ├── actions/            # Server actions
│   │   ├── auth.actions.ts
│   │   ├── finnhub.actions.ts
│   │   ├── watchlist.actions.ts
│   │   └── user.actions.ts
│   ├── middleware/         # Custom middleware
│   │   └── rate-limit.ts
│   ├── validations/        # Zod schemas
│   ├── better-auth/        # Authentication setup
│   ├── inngest/           # Background jobs
│   ├── nodemailer/        # Email service
│   ├── api-error-handler.ts    # Centralized error handling
│   ├── cache.ts                # LRU cache manager
│   ├── env.ts                  # Environment validation
│   ├── errors.ts               # Custom error classes
│   ├── logger.ts               # Structured logging
│   ├── rate-limiter.ts         # Rate limiting
│   ├── request-deduplicator.ts # Request deduplication
│   └── utils.ts                # Utility functions
│
├── database/               # Database layer
│   ├── models/            # Mongoose models
│   └── mongoose.ts        # DB connection manager
│
├── hooks/                 # React hooks
├── types/                 # TypeScript types
├── middleware/            # Next.js middleware
└── public/               # Static assets
```

## 🔄 Data Flow

### Authentication Flow
```
User → Sign Up Form → Validation (Zod)
  → Server Action → Better Auth → MongoDB
  → Inngest Event → Email Service → User
```

### Stock Search Flow
```
User → Search Input → Debounce (500ms)
  → Server Action → Request Deduplicator
  → Cache Check → Finnhub API → Response
  → Format & Return → Client
```

### Watchlist Flow
```
User → Add to Watchlist → Server Action
  → Validation → MongoDB → Success
  → Client Update → UI Refresh
```

## 🛡️ Security Layers

### 1. Input Validation
- **Where**: All user inputs
- **How**: Zod schemas in `lib/validations/`
- **Why**: Prevent injection attacks and data corruption

### 2. Authentication
- **Where**: Protected routes via middleware
- **How**: Better Auth with MongoDB adapter
- **Why**: Secure user sessions and data access

### 3. Rate Limiting
- **Where**: API routes and server actions
- **How**: LRU cache-based limiter
- **Why**: Prevent abuse and DDoS attacks

### 4. Environment Validation
- **Where**: Application startup
- **How**: Zod schema in `lib/env.ts`
- **Why**: Ensure all required secrets are present

### 5. Error Handling
- **Where**: Every layer
- **How**: Error boundaries + centralized handlers
- **Why**: Graceful degradation and security

## 🎯 Key Design Decisions

### 1. Server Actions over API Routes
**Why**: Better TypeScript integration, automatic serialization, simpler error handling

**When to use API Routes**: Webhooks, third-party integrations, non-Next.js clients

### 2. Request Deduplication
**Why**: Prevent redundant API calls to external services (Finnhub)

**Implementation**: In-memory cache of pending promises

### 3. Structured Logging
**Why**: Better debugging, monitoring integration, production-ready

**Implementation**: Custom logger with different levels

### 4. LRU Cache
**Why**: Memory-efficient caching without external dependencies

**When to upgrade**: Switch to Redis when scaling horizontally

### 5. Better Auth
**Why**: Modern, type-safe, flexible authentication

**Alternative**: NextAuth.js, Auth0, Clerk

## 🔌 External Integrations

### 1. Finnhub API
- **Purpose**: Stock data, market news, company profiles
- **Rate Limit**: 60 calls/minute (free tier)
- **Caching**: 5-15 minutes depending on data type
- **Error Handling**: Graceful fallback to empty data

### 2. Google Gemini AI
- **Purpose**: Generate personalized welcome emails
- **Integration**: Via Inngest AI step
- **Rate Limit**: Per Google Cloud quota
- **Error Handling**: Fallback to default message

### 3. TradingView Widgets
- **Purpose**: Interactive charts and market data
- **Integration**: Client-side script injection
- **Caching**: TradingView handles caching
- **Error Handling**: Widget error boundaries

### 4. Nodemailer + Gmail
- **Purpose**: Transactional emails
- **Security**: Gmail app password, 2FA required
- **Rate Limit**: 500 emails/day (Gmail limit)
- **Error Handling**: Logged but doesn't block user flow

## 📊 Performance Optimization

### 1. React Cache
- Used in server actions for request deduplication
- Automatic cache invalidation on page refresh

### 2. Next.js ISR
- Static generation with revalidation
- Used for stock profiles (1 hour)
- Used for news feeds (5 minutes)

### 3. Connection Pooling
- MongoDB: 2-10 connections
- Reuses connections across requests
- Handles disconnections gracefully

### 4. Code Splitting
- Automatic by Next.js
- Dynamic imports for heavy components
- Lazy loading for non-critical features

## 🧪 Testing Strategy

### Unit Tests
- **Location**: `lib/__tests__/`
- **Coverage**: Utils, validations, rate limiter
- **Framework**: Jest + Testing Library

### Integration Tests
- **Future**: Test server actions with test database
- **Tools**: Jest + MongoDB Memory Server

### E2E Tests
- **Future**: Critical user flows
- **Tools**: Playwright or Cypress

## 🚀 Deployment Strategy

### Development
```bash
npm run dev          # Start dev server
npm run lint         # Check linting
npm run type-check   # Check types
npm test             # Run tests
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### CI/CD
- GitHub Actions workflow in `.github/workflows/ci.yml`
- Runs on: push to main/develop, pull requests
- Steps: lint → type-check → test → build

## 🔍 Monitoring

### Application Health
- **Endpoint**: `/api/health`
- **Checks**: Database connection, API status
- **Monitoring**: Uptime robot, Pingdom

### Error Tracking
- **Tool**: Sentry (to be integrated)
- **Coverage**: Client and server errors
- **Alerts**: Email/Slack on critical errors

### Analytics
- **Tool**: PostHog/Mixpanel (to be integrated)
- **Events**: User actions, feature usage
- **Goals**: Conversion tracking

## 🔄 Future Enhancements

### Short Term
- [ ] Add comprehensive test coverage (>80%)
- [ ] Integrate Sentry for error tracking
- [ ] Add end-to-end tests
- [ ] Implement real-time stock updates (WebSocket)

### Medium Term
- [ ] Add portfolio tracking
- [ ] Implement stock alerts
- [ ] Add social features (share watchlists)
- [ ] Mobile app (React Native)

### Long Term
- [ ] AI-powered stock recommendations
- [ ] Advanced charting and technical analysis
- [ ] Multi-currency support
- [ ] Institutional features

---

**Last Updated**: November 23, 2025
**Version**: 1.0.0
