# MarketGlimpse - Stock Market Dashboard

A modern, production-ready stock market dashboard built with Next.js 16, React 19, and TypeScript. Track stocks, get market insights, and receive personalized investment recommendations.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password authentication with Better Auth
- 📊 **Real-time Market Data** - Live stock prices and market information via Finnhub API
- 📰 **Market News** - Curated news feed for your watchlist
- ⭐ **Watchlist Management** - Track your favorite stocks
- 🤖 **AI-Powered Insights** - Personalized recommendations using Google Gemini
- 📧 **Email Notifications** - Welcome emails and market updates
- 📈 **Interactive Charts** - TradingView widgets for advanced analysis
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Radix UI

## 🏗️ System Architecture

### High-Level Overview

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

### Data Flow

#### Authentication Flow
User → Sign Up Form → Validation (Zod) → Server Action → Better Auth → MongoDB → Inngest Event → Email Service → User

#### Stock Search Flow
User → Search Input → Debounce (500ms) → Server Action → Request Deduplicator → Cache Check → Finnhub API → Response → Format & Return → Client

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB database
- API keys (Finnhub, Google Gemini)
- Gmail account for email sending

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/karthikeya1220/MarketGlimpse.git
   cd stock-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys and secrets.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
# Environment
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Authentication (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# External APIs
FINNHUB_API_KEY=your-finnhub-api-key
GEMINI_API_KEY=your-gemini-api-key

# Email
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-gmail-app-password
```

See [.env.example](.env.example) for detailed documentation.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
npm test             # Run tests
npm test:watch       # Run tests in watch mode
```

### Code Quality

This project enforces high code quality standards:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **Jest** for unit testing

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Forms**: React Hook Form
- **Validation**: Zod

### Backend
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth
- **Background Jobs**: Inngest
- **Email**: Nodemailer
- **API Integration**: Finnhub, Google Gemini

### DevOps
- **CI/CD**: GitHub Actions
- **Testing**: Jest, React Testing Library
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier

## 🛡️ Security

- **Input Validation**: All user inputs are validated with Zod schemas.
- **Authentication**: Secure session management with Better Auth.
- **Rate Limiting**: API routes and server actions are rate-limited to prevent abuse.
- **Environment Validation**: Critical environment variables are validated at startup.
- **Security Headers**: HSTS, CSP, and other security headers are configured.

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for a complete security checklist.

## 📁 Directory Structure

```
stock-app/
├── app/                      # Next.js App Router
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   └── forms/                # Form components
├── lib/                      # Core business logic
│   ├── actions/              # Server actions
│   ├── validations/          # Zod schemas
│   └── utils.ts              # Utility functions
├── database/                 # Database layer
├── hooks/                    # React hooks
├── types/                    # TypeScript types
└── public/                   # Static assets
```

## 📦 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

### Docker

```bash
docker build -t stock-app .
docker run -p 3000:3000 --env-file .env stock-app
```

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for a complete deployment guide.

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Developer**: Darshan Karthikeya
- **Repository**: [karthikeya1220/MarketGlimpse](https://github.com/karthikeya1220/MarketGlimpse)
