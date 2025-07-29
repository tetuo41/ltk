# LTK Astro Website

League The k4sen (LTK) 2025 tournament website built with **Astro** and **TypeScript**.

## 🏆 Tournament Information

- **Tournament**: League The k4sen: League of Legends Streamer's Championship
- **Season**: 精霊の花祭り 幽明の境 (Spirit Flower Festival: Border of Light and Dark)
- **Host**: k4sen (ZETA DIVISION)
- **Supported by**: Riot Games
- **Duration**: June 25 - August 27, 2025
- **Teams**: 4 teams, 48 streamers total

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) v4.15.9 - Static Site Generator
- **Language**: [TypeScript](https://www.typescriptlang.org/) v5.6.2 - Type Safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4.17 - Utility-first CSS
- **Testing**: [Playwright](https://playwright.dev/) v1.54.1 - Visual regression testing
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient
- **Container**: Podman/Docker compatible
- **Deployment**: [Netlify](https://netlify.com/) (Production), Static hosting compatible

## 📁 Project Structure

```
ltk-astro/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Header.astro     # Navigation header
│   │   ├── TeamCard.astro   # Team information display
│   │   ├── StandingsTable.astro # Tournament standings
│   │   ├── BanPickDisplay.astro # LoL ban/pick information
│   │   └── Footer.astro     # Site footer
│   ├── layouts/
│   │   └── Layout.astro     # Base page layout
│   ├── pages/
│   │   └── index.astro      # Main tournament page
│   ├── types/               # TypeScript type definitions
│   │   ├── teams.ts         # Team and player types
│   │   ├── matches.ts       # Match and tournament types
│   │   ├── common.ts        # Shared utility types
│   │   └── index.ts         # Type exports
│   └── data/                # Static tournament data
│       ├── ltk-sbb-teams.json    # Team rosters and info
│       └── ltk-sbb-matches.json  # Match results, schedule, ban/pick data
├── tests/                   # Playwright test files
│   └── ban-pick-layout.spec.ts # Visual regression tests
├── playwright.config.ts     # Playwright configuration
├── tailwind.config.mjs      # Tailwind CSS configuration
├── astro.config.mjs         # Astro configuration
├── netlify.toml            # Netlify deployment settings
├── Dockerfile               # Multi-stage container build
├── docker-compose.yml       # Container orchestration
├── nginx.conf              # Production web server config
└── package.json            # Dependencies and scripts
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Podman or Docker (for containerized development)

### Local Development (Node.js)

```bash
# Clone and navigate to the project
cd ltk-astro

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:4321
```

### Available Scripts

```bash
pnpm dev          # Start development server with HMR
pnpm build        # Build for production (standard build)
pnpm build:check  # Build with TypeScript type checking
pnpm preview      # Preview production build locally
pnpm check        # Run TypeScript type checking only
pnpm lint         # Run ESLint for code quality

# Testing Commands
pnpm playwright test              # Run all Playwright tests
pnpm playwright test --grep "responsive" # Run responsive tests only
pnpm playwright test --ui         # Interactive test mode
pnpm exec playwright show-report  # View test results

# Domain Management Commands
pnpm run domain:setup             # Automated DNS setup for shiai.games
pnpm run domain:status            # Check current DNS records status
netlify domains:add ltk-sbb.shiai.games  # Add custom domain to site
```

## 🐳 Container Development with Podman

### Development Environment

```bash
# Build development image
podman build -t ltk-astro:dev --target development .

# Run development container
podman run -d \
  --name ltk-dev \
  -p 4321:4321 \
  -v "${PWD}":/app:Z \
  ltk-astro:dev

# View logs
podman logs -f ltk-dev

# Access the application at http://localhost:4321
```

### Production Build

```bash
# Build production image
podman build -t ltk-astro:prod --target production .

# Run production container
podman run -d \
  --name ltk-prod \
  -p 8080:80 \
  ltk-astro:prod

# Access the application at http://localhost:8080
```

### Using Docker Compose / Podman Compose

```bash
# Development mode
podman-compose up ltk-dev

# Production mode
podman-compose --profile production up ltk-prod

# With reverse proxy
podman-compose --profile proxy up

# Stop all services
podman-compose down
```

### Container Management Commands

```bash
# List running containers
podman ps

# Stop a container
podman stop ltk-dev

# Remove a container
podman rm ltk-dev

# View container logs
podman logs ltk-dev

# Execute commands in running container
podman exec -it ltk-dev sh

# Clean up images
podman image prune
```

## 🏗️ Building and Deployment

### Static Build

```bash
# Create production build
pnpm build

# Output will be in ./dist/ directory
```

### Container Production Deploy

```bash
# Build production image
podman build -t ltk-astro:latest --target production .

# Tag for registry (optional)
podman tag ltk-astro:latest registry.example.com/ltk-astro:latest

# Push to registry (optional)
podman push registry.example.com/ltk-astro:latest
```

## 🌍 Deployment Options

### Free Static Hosting

1. **Netlify** (Current Production - Recommended)
   - **Live Site**: https://ltk-sbb.shiai.games
   - **Netlify URL**: https://ltk-fansite.netlify.app
   - Build Command: `pnpm build`
   - Publish Directory: `dist`
   - Auto-deploy from `main` branch
   - Custom domain with HTTPS

2. **Vercel**
   - Import project from GitHub
   - Automatic Astro detection

3. **GitHub Pages**
   - Enable Pages in repository settings
   - Use GitHub Actions for automated builds

4. **Surge.sh**
   ```bash
   npm install -g surge
   npm run build
   surge dist/
   ```

### Container Deployment

- **Railway**: Connect GitHub and deploy
- **Render**: Docker container deployment
- **DigitalOcean App Platform**: Container support
- **Google Cloud Run**: Serverless containers
- **AWS ECS/Fargate**: Enterprise container deployment

## 🧪 Testing and Quality

### Type Checking

```bash
# Run TypeScript type checking
pnpm check

# Watch mode for development
pnpm astro check --watch
```

### Visual Regression Testing

```bash
# Run all Playwright tests
pnpm playwright test

# Run specific test suites
pnpm playwright test --grep "responsive"    # Responsive design tests
pnpm playwright test --grep "ban-pick"      # Ban/pick layout tests

# Interactive testing with UI
pnpm playwright test --ui

# View detailed test reports
pnpm exec playwright show-report
```

### Testing Features

- **Layout Validation**: Ensures components don't overflow containers
- **Responsive Design**: Tests across mobile (375px), tablet (768px), desktop (1920px)
- **Visual Screenshots**: Automated screenshot capture for manual review
- **Ban/Pick Testing**: Specific tests for League of Legends draft information display

### Container Health Checks

```bash
# Check container health
podman inspect ltk-dev | grep -A 5 "Health"

# Manual health check
curl http://localhost:4321/health
```

## 📊 Performance Optimization

### Build Optimization

- **Static Generation**: All pages pre-rendered at build time
- **Tailwind CSS**: Utility-first styling with purged CSS in production
- **JavaScript Islands**: Minimal client-side JavaScript with Astro
- **Image Optimization**: WebP support and responsive images
- **TypeScript**: Full type safety with zero-runtime overhead

### Container Optimization

- **Multi-stage Build**: Separate build and runtime environments
- **Alpine Linux**: Minimal base image size
- **Layer Caching**: Optimized Dockerfile layer ordering
- **Health Checks**: Built-in container monitoring

## 🔧 Configuration

### Environment Variables

```bash
# Development
NODE_ENV=development
ASTRO_HOST=0.0.0.0
ASTRO_PORT=4321

# Production
NODE_ENV=production
```

### Astro Configuration

Edit `astro.config.mjs` for:
- Output mode (static/hybrid/server)
- Integrations (React, Vue, Svelte, etc.)
- Build settings
- Server configuration

## 📁 Data Management

### Tournament Data Updates

1. **Teams**: Edit `src/data/ltk-sbb-teams.json` for roster changes
2. **Matches**: Edit `src/data/ltk-sbb-matches.json` for schedule, results, and ban/pick data
3. **Types**: Update `src/types/*.ts` if schema changes
4. **Test**: Run `pnpm playwright test` to verify responsive design
5. **Rebuild**: Run `pnpm build` or restart dev server

### Adding Ban/Pick Data

Add League of Legends draft information to match results:

```json
{
  "result": {
    "winner": "team_name",
    "score": "1-0",
    "draft": {
      "bans": {
        "team1": ["Yasuo", "Zed", "Katarina"],
        "team2": ["Jinx", "Thresh", "Lee Sin"]
      },
      "picks": {
        "team1": ["Azir", "Graves", "Nautilus", "Kai'Sa", "Ornn"],
        "team2": ["Syndra", "Kindred", "Leona", "Aphelios", "Shen"]
      }
    }
  }
}
```

### Data Schema

- **Fully Typed**: Complete TypeScript interfaces for all data structures
- **League of Legends Integration**: `ChampionDraft` interface for ban/pick data
- **Type Safety**: Compile-time validation of all data imports
- **Auto-completion**: Full IDE support with typed data access

## 🛡️ Security

### Container Security

- Non-root user in production
- Minimal attack surface with Alpine Linux
- Security headers in Nginx configuration
- Health checks for monitoring

### Web Security

- Content Security Policy (CSP)
- XSS Protection headers
- HTTPS enforcement (in production)
- CORS configuration

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process using port 4321
lsof -ti:4321 | xargs kill -9

# Or use different port
pnpm dev --port 3000
```

**Container build fails:**
```bash
# Clean up Docker/Podman cache
podman system prune -a

# Rebuild without cache
podman build --no-cache -t ltk-astro:dev .
```

**TypeScript errors:**
```bash
# Clear TypeScript cache
rm -rf .astro/
pnpm check
```

**Playwright test failures:**
```bash
# View test report
pnpm exec playwright show-report

# Run tests in debug mode
pnpm playwright test --debug

# Update test snapshots (if visual changes are expected)
pnpm playwright test --update-snapshots
```

**Responsive design issues:**
```bash
# Run responsive tests specifically
pnpm playwright test --grep "responsive"

# Check mobile viewport behavior
pnpm playwright test --grep "mobile"
```

**Volume mounting issues (SELinux):**
```bash
# Add :Z flag for SELinux systems
podman run -v "${PWD}":/app:Z ltk-astro:dev
```

## 📞 Support

- **Live Site**: [ltk-fansite.netlify.app](https://ltk-fansite.netlify.app)
- **Tournament Info**: [k4sen Twitch](https://www.twitch.tv/thek4sen)
- **Technical Issues**: Check container logs, TypeScript errors, and Playwright test reports
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **Playwright Documentation**: [playwright.dev](https://playwright.dev/)
- **Podman Documentation**: [podman.io](https://podman.io/)

## 📄 License

This project is for educational and informational purposes. 

- **League of Legends** © Riot Games, Inc.
- **Tournament Content** © k4sen / ZETA DIVISION
- **Website Code** © LTK Development Team

---

Built with ❤️ using Astro, TypeScript, Tailwind CSS, and Playwright

**Current Status**: ✅ Live on Netlify | 🧪 Visual Testing | 📱 Mobile Optimized