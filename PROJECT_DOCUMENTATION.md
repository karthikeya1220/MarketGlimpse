# MarketGlimpse - Project Documentation

## 1. What Problem Does It Solve?

**Problem**: Individual investors struggle to track stock market data, manage watchlists, and get personalized investment insights in one place. Most solutions are either too complex (Bloomberg Terminal), too expensive, or lack AI-powered recommendations.

**Solution**: MarketGlimpse provides a unified, user-friendly dashboard that:
- Aggregates real-time stock market data from multiple sources
- Enables easy watchlist management for tracking favorite stocks
- Delivers AI-powered personalized investment recommendations
- Provides curated market news relevant to user's portfolio
- Offers interactive charts and technical analysis tools
- Sends timely email notifications for market updates

**Target Users**: Retail investors, day traders, and finance enthusiasts who need professional-grade tools without the complexity or cost.

---

## 2. Why This Tech Stack?

### Frontend Stack

**Next.js 16 (App Router)**
- **Why**: Server-side rendering for SEO, built-in API routes, excellent performance
- **Alternative considered**: Create React App (lacks SSR), Remix (smaller ecosystem)

**React 19**
- **Why**: Latest features, improved performance, better concurrent rendering
- **Alternative considered**: Vue.js (smaller community for finance apps), Svelte (less mature ecosystem)

**TypeScript**
- **Why**: Type safety prevents runtime errors, better IDE support, self-documenting code
- **Alternative considered**: JavaScript (error-prone for complex financial data)

**Tailwind CSS + Radix UI**
- **Why**: Rapid development, consistent design system, accessible components
- **Alternative considered**: Material UI (heavier bundle), Chakra UI (less customizable)

### Backend Stack

**MongoDB + Mongoose**
- **Why**: Flexible schema for evolving data models, excellent performance for read-heavy operations
- **Alternative considered**: PostgreSQL (overkill for current scale), Firebase (vendor lock-in)

**Better Auth**
- **Why**: Modern, type-safe, flexible authentication with MongoDB adapter
- **Alternative considered**: NextAuth.js (less type-safe), Clerk (expensive), Auth0 (complex setup)

**Server Actions**
- **Why**: Type-safe client-server communication, automatic serialization, simpler than API routes
- **When API routes used**: Webhooks (Inngest), third-party integrations

### External Services

**Finnhub API**
- **Why**: Comprehensive stock data, generous free tier (60 calls/min), reliable uptime
- **Alternative considered**: Alpha Vantage (lower rate limits), Yahoo Finance (unofficial API)

**Google Gemini AI**
- **Why**: Advanced language model, good at financial analysis, cost-effective
- **Alternative considered**: OpenAI GPT (more expensive), Claude (limited availability)

**Inngest**
- **Why**: Reliable background job processing, built-in retries, easy debugging
- **Alternative considered**: BullMQ (requires Redis), Temporal (complex setup)

**Nodemailer + Gmail**
- **Why**: Simple setup, reliable delivery, free for low volume
- **Alternative considered**: SendGrid (paid), AWS SES (complex setup)

### Development Tools

**Zod**
- **Why**: Runtime validation, TypeScript integration, excellent error messages
- **Alternative considered**: Yup (less TypeScript support), Joi (verbose syntax)

**Jest + React Testing Library**
- **Why**: Industry standard, great documentation, comprehensive testing utilities
- **Alternative considered**: Vitest (newer, less mature), Cypress (E2E only)

---

## 3. System Architecture

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                    │
│  • React 19 Components                                       │
│  • TailwindCSS Styling                                       │
│  • Client-side State Management                              │
│  • TradingView Widgets                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Middleware Layer (Edge)                    │
│  • Rate Limiting (LRU Cache)                                 │
│  • Authentication Check (Better Auth)                        │
│  • Request Deduplication                                     │
│  • Security Headers                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Application Layer (Next.js Server)              │
│  • Server Actions (Type-safe RPC)                            │
│  • API Routes (Webhooks)                                     │
│  • Input Validation (Zod)                                    │
│  • Error Handling (Centralized)                              │
│  • Logging (Structured)                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  External APIs   │  │  Database Layer  │
        │  • Finnhub       │  │  • MongoDB       │
        │  • Gemini AI     │  │  • Mongoose ODM  │
        │  • TradingView   │  │  • Connection    │
        │  • Gmail SMTP    │  │    Pooling       │
        └──────────────────┘  └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌──────────────────┐
                    │ Background Jobs  │
                    │  • Inngest       │
                    │  • Email Queue   │
                    │  • AI Processing │
                    └──────────────────┘
```

### Key Components

**1. Client Layer**
- React components with hooks for state management
- Form handling with React Hook Form
- Real-time chart updates via TradingView widgets
- Optimistic UI updates for better UX

**2. Middleware Layer**
- Rate limiter: 100 requests/15min per IP
- Auth middleware: Protects dashboard routes
- Request deduplicator: Prevents duplicate API calls
- Security headers: HSTS, CSP, X-Frame-Options

**3. Application Layer**
- Server Actions: `auth.actions.ts`, `finnhub.actions.ts`, `watchlist.actions.ts`
- API Routes: `/api/health`, `/api/inngest`
- Validation: Zod schemas for all inputs
- Caching: LRU cache (5-15min TTL)

**4. Database Layer**
- MongoDB Atlas cluster
- Connection pooling (2-10 connections)
- Models: User, Session, Watchlist
- Indexes on frequently queried fields

**5. Background Jobs**
- Welcome email generation (AI-powered)
- Market update notifications
- Data synchronization tasks

---

## 4. How Authentication Works

### Authentication Flow

```
┌──────────────┐
│  User Signs  │
│     Up       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 1. Client Validation (React Hook Form + Zod)             │
│    • Email format check                                  │
│    • Password strength (min 8 chars)                     │
│    • Required fields validation                          │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 2. Server Action (signUp)                                │
│    • Re-validate inputs with Zod                         │
│    • Check rate limits                                   │
│    • Call Better Auth API                                │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Better Auth Processing                                │
│    • Hash password (bcrypt)                              │
│    • Create user in MongoDB                              │
│    • Generate session token                              │
│    • Set secure HTTP-only cookie                         │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 4. Post-Registration (Inngest Event)                     │
│    • Trigger welcome email job                           │
│    • Generate AI personalized message                    │
│    • Send email via Nodemailer                           │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ 5. Auto Sign-In                                          │
│    • Redirect to dashboard                               │
│    • Session cookie validates requests                   │
└──────────────────────────────────────────────────────────┘
```

### Session Management

**Session Storage**: MongoDB
- Collection: `session`
- Fields: `userId`, `token`, `expiresAt`, `userAgent`, `ipAddress`

**Session Validation**:
1. Middleware reads session cookie
2. Validates token against MongoDB
3. Checks expiration time
4. Attaches user to request context

**Security Features**:
- HTTP-only cookies (prevents XSS)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)
- Session expiration (configurable)
- Password hashing with bcrypt

### Protected Routes

**Implementation**: Next.js middleware (`middleware/index.ts`)

```typescript
// Pseudo-code
if (route.startsWith('/dashboard')) {
  const session = await auth.api.getSession({ headers });
  if (!session) redirect('/sign-in');
}
```

**Protected Paths**:
- `/dashboard/*` - Main dashboard
- `/watchlist/*` - Watchlist management
- `/profile/*` - User profile

---

## 5. How Data Flows

### Stock Search Flow

```
User types "AAPL" → Debounce (500ms) → Server Action
  → Request Deduplicator (check pending)
  → Cache Check (LRU, 5min TTL)
  → Cache Miss → Finnhub API
  → Response → Cache Store
  → Format Data → Return to Client
  → Update UI
```

**Optimization Techniques**:
- **Debouncing**: Prevents API spam during typing
- **Request Deduplication**: Merges identical concurrent requests
- **LRU Caching**: Stores recent searches (max 100 items)
- **Error Handling**: Graceful fallback to cached data

### Watchlist Management Flow

```
User clicks "Add to Watchlist"
  → Optimistic UI Update (instant feedback)
  → Server Action (addToWatchlist)
  → Validate user session
  → Validate stock symbol (Zod)
  → Check duplicate
  → MongoDB Insert
  → Success → Confirm UI
  → Failure → Revert UI + Show Error
```

### Market News Flow

```
Dashboard Load → Server Component
  → Get user's watchlist from MongoDB
  → Extract stock symbols
  → Fetch news for each symbol (Finnhub)
  → Aggregate and deduplicate
  → Sort by relevance + date
  → Cache (15min TTL)
  → Render on server
  → Stream to client
```

### AI Recommendations Flow

```
User Registration → Inngest Event
  → Background Job Triggered
  → Fetch user preferences
  → Call Gemini AI API
  → Generate personalized message
  → Format email template
  → Send via Nodemailer
  → Log result
  → Update user record
```

### Real-time Chart Data

```
Client Component Mounts
  → Load TradingView Widget Script
  → Initialize with stock symbol
  → TradingView handles WebSocket
  → Real-time updates (client-side)
  → No server involvement
```

---

## 6. Scalability Improvements

### Current Limitations

**Single Server**: Runs on one instance (Vercel serverless)
**In-Memory Cache**: LRU cache doesn't scale horizontally
**Rate Limits**: Finnhub free tier (60 calls/min)
**Email Volume**: Gmail limit (500 emails/day)

### Short-term Improvements (0-6 months)

**1. Implement Redis Cache**
- **Why**: Shared cache across multiple instances
- **Impact**: Reduces API calls by 70-80%
- **Implementation**: Replace LRU cache with Redis
- **Cost**: ~$10/month (Upstash/Railway)

**2. Upgrade Finnhub Plan**
- **Why**: Higher rate limits (300 calls/min)
- **Impact**: Supports 5x more users
- **Cost**: ~$50/month

**3. Implement CDN**
- **Why**: Faster static asset delivery
- **Impact**: 40% faster page loads globally
- **Implementation**: Cloudflare/Vercel Edge
- **Cost**: Free tier available

**4. Database Indexing**
- **Why**: Faster queries as data grows
- **Impact**: 10x faster watchlist queries
- **Implementation**: Add indexes on `userId`, `symbol`, `createdAt`
- **Cost**: Free

**5. Switch to Transactional Email Service**
- **Why**: Higher volume, better deliverability
- **Impact**: Support 10,000+ emails/day
- **Implementation**: SendGrid/AWS SES
- **Cost**: ~$15/month

### Medium-term Improvements (6-12 months)

**1. Horizontal Scaling**
- **Current**: Single serverless function
- **Future**: Multiple instances behind load balancer
- **Benefit**: Handle 10x traffic
- **Requirements**: Redis for session storage, stateless architecture

**2. Database Read Replicas**
- **Current**: Single MongoDB instance
- **Future**: Primary + 2 read replicas
- **Benefit**: 3x read throughput
- **Use case**: Separate reads (watchlist, news) from writes (user actions)

**3. Implement WebSocket for Real-time Updates**
- **Current**: Polling/manual refresh
- **Future**: WebSocket connections for live prices
- **Benefit**: Real-time updates without page refresh
- **Technology**: Socket.io or Pusher

**4. API Response Pagination**
- **Current**: Return all watchlist items
- **Future**: Paginate (20 items per page)
- **Benefit**: Faster response times, lower memory usage

**5. Implement Service Workers**
- **Current**: No offline support
- **Future**: PWA with offline caching
- **Benefit**: Works offline, faster repeat visits

### Long-term Improvements (12+ months)

**1. Microservices Architecture**
```
Current: Monolithic Next.js app
Future:
  ├── API Gateway (Kong/AWS API Gateway)
  ├── Auth Service (Dedicated)
  ├── Stock Data Service (Dedicated)
  ├── Notification Service (Dedicated)
  └── AI Service (Dedicated)
```
**Benefit**: Independent scaling, fault isolation

**2. Event-Driven Architecture**
- **Technology**: Kafka/RabbitMQ
- **Use case**: Decouple services, async processing
- **Example**: User action → Event → Multiple services react

**3. Advanced Caching Strategy**
```
L1: Browser Cache (static assets)
L2: CDN Edge Cache (API responses)
L3: Redis Cache (application data)
L4: Database Query Cache
```

**4. Database Sharding**
- **When**: 10M+ users
- **Strategy**: Shard by userId
- **Benefit**: Unlimited horizontal scaling

**5. Machine Learning Pipeline**
- **Current**: Basic AI recommendations
- **Future**: ML models for price prediction, portfolio optimization
- **Infrastructure**: Separate ML service, model versioning

### Monitoring & Observability

**Implement**:
- **APM**: Datadog/New Relic for performance monitoring
- **Error Tracking**: Sentry for error aggregation
- **Logging**: ELK stack for centralized logs
- **Metrics**: Prometheus + Grafana for custom metrics
- **Alerts**: PagerDuty for critical issues

### Cost Optimization

**Current Monthly Cost**: ~$50
- MongoDB Atlas: $0 (free tier)
- Vercel: $0 (hobby tier)
- Finnhub: $0 (free tier)
- Gemini: ~$5
- Domain: ~$15/year

**At 10K Users**: ~$300/month
- MongoDB: $57 (M10 cluster)
- Vercel: $20 (Pro tier)
- Redis: $10 (Upstash)
- Finnhub: $50 (Starter plan)
- SendGrid: $15 (Essentials)
- Gemini: ~$50
- Monitoring: $100 (Datadog)

**At 100K Users**: ~$2,000/month
- Infrastructure: $1,200
- APIs: $400
- Monitoring: $200
- CDN: $200

---

## Performance Benchmarks

**Current Performance**:
- Time to First Byte (TTFB): <200ms
- First Contentful Paint (FCP): <1.2s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- Lighthouse Score: 95+

**Scalability Targets**:
- Support 10K concurrent users
- <500ms API response time (p95)
- 99.9% uptime
- <1% error rate

---

**Last Updated**: December 31, 2024
**Version**: 1.0.0
**Author**: Darshan Karthikeya
