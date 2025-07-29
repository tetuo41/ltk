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

- **Framework**: [Astro](https://astro.build/) - Static Site Generator
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type Safety
- **Styling**: CSS with CSS Custom Properties
- **Container**: Podman/Docker compatible
- **Deployment**: Static hosting (Netlify, Vercel, GitHub Pages)

## 📁 Project Structure

```
ltk-astro/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Header.astro     # Navigation header
│   │   ├── TeamCard.astro   # Team information display
│   │   ├── StandingsTable.astro # Tournament standings
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
│       ├── teams.json       # Team rosters and info
│       └── matches.json     # Match results and schedule
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
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm check        # Run TypeScript type checking
pnpm lint         # Run ESLint (if configured)
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

1. **Netlify** (Recommended)
   - Drag and drop `dist/` folder
   - Or connect GitHub repository for auto-deploy

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
- **CSS Optimization**: Scoped styles with minimal runtime CSS
- **JavaScript Islands**: Minimal client-side JavaScript
- **Image Optimization**: WebP support and responsive images

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

1. **Teams**: Edit `src/data/teams.json`
2. **Matches**: Edit `src/data/matches.json`
3. **Types**: Update `src/types/*.ts` if schema changes
4. **Rebuild**: Run `pnpm build` or restart dev server

### Data Schema

- Fully typed with TypeScript interfaces
- JSON Schema validation (optional)
- Type-safe data imports in components

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

**Volume mounting issues (SELinux):**
```bash
# Add :Z flag for SELinux systems
podman run -v "${PWD}":/app:Z ltk-astro:dev
```

## 📞 Support

- **Tournament Info**: [k4sen Twitch](https://www.twitch.tv/thek4sen)
- **Technical Issues**: Check container logs and TypeScript errors
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build/)
- **Podman Documentation**: [podman.io](https://podman.io/)

## 📄 License

This project is for educational and informational purposes. 

- **League of Legends** © Riot Games, Inc.
- **Tournament Content** © k4sen / ZETA DIVISION
- **Website Code** © LTK Development Team

---

Built with ❤️ using Astro, TypeScript, and Podman