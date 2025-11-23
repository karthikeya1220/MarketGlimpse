# MarketGlimpse - Stock Market DashboardThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern, production-ready stock market dashboard built with Next.js 16, React 19, and TypeScript. Track stocks, get market insights, and receive personalized investment recommendations.## Getting Started



## ✨ FeaturesFirst, run the development server:



- 🔐 **Secure Authentication** - Email/password authentication with Better Auth```bash

- 📊 **Real-time Market Data** - Live stock prices and market information via Finnhub APInpm run dev

- 📰 **Market News** - Curated news feed for your watchlist# or

- ⭐ **Watchlist Management** - Track your favorite stocksyarn dev

- 🤖 **AI-Powered Insights** - Personalized recommendations using Google Gemini# or

- 📧 **Email Notifications** - Welcome emails and market updatespnpm dev

- 📈 **Interactive Charts** - TradingView widgets for advanced analysis# or

- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Radix UIbun dev

```

## 🚀 Quick Start

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prerequisites

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- Node.js 20+ 

- MongoDB databaseThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- API keys (Finnhub, Google Gemini)

- Gmail account for email sending## Learn More



### InstallationTo learn more about Next.js, take a look at the following resources:



```bash- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

# Clone the repository- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

git clone https://github.com/karthikeya1220/MarketGlimpse.git

cd stock-appYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



# Install dependencies## Deploy on Vercel

npm install

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

# Copy environment variables

cp .env.example .envCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Edit .env and add your API keys
nano .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Environment Variables

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

## 📚 Documentation

- [Production Checklist](PRODUCTION_CHECKLIST.md) - Complete deployment guide
- [Architecture](ARCHITECTURE.md) - System design and architecture
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Development progress

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

This project includes:

- ✅ TypeScript for type safety
- ✅ ESLint for code linting
- ✅ Prettier for code formatting
- ✅ Husky for pre-commit hooks
- ✅ Jest for unit testing
- ✅ GitHub Actions for CI/CD

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

## 🔐 Security Features

- ✅ Input validation with Zod schemas
- ✅ Rate limiting on API routes
- ✅ Environment variable validation
- ✅ Secure authentication with Better Auth
- ✅ Request deduplication
- ✅ Error boundaries for graceful failures
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Structured logging

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

Test files are located in `lib/__tests__/`.

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t stock-app .

# Run container
docker run -p 3000:3000 --env-file .env stock-app
```

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for complete deployment guide.

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

## 🐛 Known Issues

See [GitHub Issues](https://github.com/karthikeya1220/MarketGlimpse/issues) for a list of known issues and feature requests.

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Built with ❤️ using Next.js and TypeScript**
