# Production Deployment Checklist

## 🔒 Security

### Environment Variables
- [ ] Rotate all API keys and secrets
- [ ] Generate new `BETTER_AUTH_SECRET`: `openssl rand -base64 32`
- [ ] Use production MongoDB cluster with authentication
- [ ] Enable IP whitelisting for MongoDB
- [ ] Use secure Gmail app password (not regular password)
- [ ] Never commit `.env` file to version control
- [ ] Set up environment variables in your hosting platform

### Authentication & Authorization
- [ ] Enable email verification for Better Auth
- [ ] Set up password reset functionality
- [ ] Configure session timeout appropriately
- [ ] Review and test authentication flows
- [ ] Implement CSRF protection if needed

### API Security
- [ ] Review and adjust rate limiting settings
- [ ] Enable CORS with specific origins only
- [ ] Validate all user inputs with Zod schemas
- [ ] Implement API authentication tokens
- [ ] Set up API key rotation policy

### Headers & SSL
- [ ] Enable HTTPS/SSL certificate
- [ ] Verify security headers in `next.config.ts`
- [ ] Test Content Security Policy (CSP)
- [ ] Enable HSTS (already configured)
- [ ] Configure DNS properly

## 🚀 Performance

### Caching
- [ ] Configure Redis for production caching (optional upgrade from LRU)
- [ ] Set appropriate cache TTLs for different data types
- [ ] Implement CDN for static assets
- [ ] Enable Next.js ISR where appropriate

### Database
- [ ] Set up MongoDB indexes for frequently queried fields
- [ ] Configure connection pooling (already set: min 2, max 10)
- [ ] Enable MongoDB monitoring and alerts
- [ ] Set up database backups
- [ ] Test database failover

### Optimization
- [ ] Run `npm run build` and check for warnings
- [ ] Analyze bundle size: `npm run build -- --analyze`
- [ ] Optimize images and assets
- [ ] Enable compression (already configured)
- [ ] Test performance with Lighthouse

## 📊 Monitoring & Logging

### Error Tracking
- [ ] Integrate Sentry for error tracking
- [ ] Set up error alerting
- [ ] Configure error sampling rates
- [ ] Test error reporting flows

### Analytics
- [ ] Set up PostHog/Mixpanel/GA4
- [ ] Implement event tracking
- [ ] Set up conversion funnels
- [ ] Configure user identification

### Logging
- [ ] Configure structured logging service (DataDog, CloudWatch, etc.)
- [ ] Set up log aggregation
- [ ] Configure log retention policies
- [ ] Set up critical alerts

### Health Checks
- [ ] Test `/api/health` endpoint
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Configure alerting for downtime
- [ ] Test failover scenarios

## 🧪 Testing

### Before Deployment
- [ ] Run all tests: `npm test`
- [ ] Run type checking: `npm run type-check`
- [ ] Run linting: `npm run lint`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Test critical user flows manually

### Post-Deployment
- [ ] Test authentication flows
- [ ] Test API endpoints
- [ ] Verify email sending works
- [ ] Test watchlist functionality
- [ ] Check TradingView widgets load
- [ ] Test on multiple browsers/devices

## 📦 Build & Deploy

### Pre-Deploy
- [ ] Update `README.md` with production setup
- [ ] Document API endpoints
- [ ] Update environment variable documentation
- [ ] Tag release in git: `git tag -a v1.0.0 -m "Release v1.0.0"`

### Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Build the application: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Deploy to hosting platform (Vercel/Railway/AWS/etc.)
- [ ] Verify deployment succeeded

### Post-Deploy
- [ ] Run smoke tests on production
- [ ] Check all environment variables are set
- [ ] Verify database connectivity
- [ ] Test external API integrations
- [ ] Monitor error rates for 24 hours

## 🔄 CI/CD

### GitHub Actions (Already Configured)
- [ ] Verify CI pipeline runs successfully
- [ ] Set up deployment workflows
- [ ] Configure secrets in GitHub
- [ ] Enable branch protection rules
- [ ] Set up automated deployments

### Additional Setup
- [ ] Configure staging environment
- [ ] Set up preview deployments for PRs
- [ ] Configure rollback procedures
- [ ] Document deployment process

## 📱 Platform-Specific

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add BETTER_AUTH_SECRET production
# ... repeat for all env vars
```

### Railway
```bash
# Install Railway CLI
npm i -g railway

# Link to project
railway link

# Deploy
railway up

# Set environment variables in Railway dashboard
```

### Docker
```bash
# Build image
docker build -t stock-app .

# Run container
docker run -p 3000:3000 --env-file .env stock-app

# Push to registry
docker tag stock-app registry.example.com/stock-app:latest
docker push registry.example.com/stock-app:latest
```

## 🔐 Secrets Management

### Required Secrets
1. **BETTER_AUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Must be at least 32 characters
   - Rotate quarterly

2. **MONGODB_URI**
   - Use production cluster
   - Enable authentication
   - Restrict IP access
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

3. **FINNHUB_API_KEY**
   - Get from: https://finnhub.io/
   - Monitor usage limits
   - Set up billing alerts

4. **GEMINI_API_KEY**
   - Get from: https://makersuite.google.com/app/apikey
   - Monitor quota usage
   - Configure rate limits

5. **NODEMAILER_EMAIL & NODEMAILER_PASSWORD**
   - Use Gmail app password
   - Generate: https://myaccount.google.com/apppasswords
   - Enable 2FA on Gmail account

## 📈 Scaling Considerations

### When to Scale
- Monitor CPU/memory usage
- Track response times
- Watch database connection pool
- Monitor API rate limits

### Horizontal Scaling
- [ ] Use load balancer
- [ ] Configure session affinity
- [ ] Share cache across instances (Redis)
- [ ] Use managed database

### Database Scaling
- [ ] Set up read replicas
- [ ] Implement database sharding if needed
- [ ] Optimize slow queries
- [ ] Monitor connection pool usage

## 🐛 Debugging Production Issues

### Logs
```bash
# Vercel logs
vercel logs <deployment-url>

# Railway logs
railway logs

# Docker logs
docker logs <container-id>
```

### Common Issues
1. **Environment variables not set**: Check platform dashboard
2. **Database connection fails**: Verify IP whitelist and credentials
3. **API rate limits**: Check Finnhub/Gemini usage
4. **Email not sending**: Verify Gmail app password and 2FA

## 🔄 Maintenance

### Regular Tasks
- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies: `npm update`
- [ ] Monthly: Security audit: `npm audit`
- [ ] Quarterly: Rotate secrets
- [ ] Quarterly: Review and optimize database queries

### Backup Strategy
- [ ] Daily automated database backups
- [ ] Weekly backup verification
- [ ] Documented restore procedures
- [ ] Off-site backup storage

## 📞 Support

### Documentation
- API Docs: `/docs/api.md`
- Architecture: `/docs/architecture.md`
- Troubleshooting: `/docs/troubleshooting.md`

### Contacts
- DevOps: [Your Email]
- Database Admin: [Your Email]
- On-Call: [Your Phone]

---

## ✅ Final Verification

Before marking as ready for production:
- [ ] All items in this checklist completed
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Team reviewed and approved

**Date Completed**: _____________
**Deployed By**: _____________
**Production URL**: _____________
