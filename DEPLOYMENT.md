# 🚀 Quick Start - Performance Optimized Build

## Development
```bash
npm run dev
```

## Production Build
```bash
npm run build
npm run start
```

## Performance Testing
```bash
# Test production build locally
npm run build && npm run start

# Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Check bundle size
npm run build -- --analyze
```

## Deployment to Vercel (Recommended)

### One-Click Deploy
```bash
vercel deploy --prod
```

### Manual Steps
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `GITHUB_TOKEN` (optional)
4. Deploy!

## Environment Setup
```bash
# Copy example file
cp .env.example .env.local

# Add your GitHub token (optional but recommended)
GITHUB_TOKEN=ghp_your_token_here
```

## Important Notes

✅ **Fonts**: Self-hosted via Next.js (faster than Google Fonts)
✅ **Images**: Auto-optimized to WebP/AVIF
✅ **Caching**: Aggressive caching for static assets
✅ **SEO**: Sitemap, robots.txt, metadata all configured
✅ **PWA**: Manifest configured for mobile installation

## Device Testing

Test on these breakpoints:
- 📱 Mobile: 375px, 390px, 428px
- 📱 Tablet: 768px, 820px, 1024px
- 💻 Desktop: 1280px, 1440px, 1920px
- 🖥️ 4K: 2560px, 3840px

## Performance Targets

- Lighthouse Score: 95+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

See [PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md) for detailed optimizations.
