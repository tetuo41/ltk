# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based static website for the LTK (League The k4sen) 2025 tournament - a League of Legends streamers championship. The site displays tournament information, team rosters, match schedules, and standings for a 4-team tournament featuring Japanese streamers.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server on http://localhost:4321 with hot reload (host 0.0.0.0)
- `pnpm start` - Alternative development server command (same as dev)
- `pnpm build` - Build static site for production (includes type checking via `astro check && astro build`)
- `pnpm preview` - Preview production build locally (host 0.0.0.0)
- `pnpm check` - Run TypeScript type checking only via `astro check`
- `pnpm lint` - Run ESLint for Astro, TypeScript, and TSX files in src directory

### Container Development (Podman/Docker)
- `./scripts/dev.sh start-dev` - Build and start development container (port 4321)
- `./scripts/dev.sh start-prod` - Build and start production container (port 8080)
- `./scripts/dev.sh build-dev` - Build development image only
- `./scripts/dev.sh build-prod` - Build production image only
- `./scripts/dev.sh logs [container]` - View container logs (defaults to dev)
- `./scripts/dev.sh shell [container]` - Open shell in container
- `./scripts/dev.sh status` - Check status of all containers
- `./scripts/dev.sh health [container] [port]` - Check container health
- `./scripts/dev.sh stop-dev` - Stop development container
- `./scripts/dev.sh stop-prod` - Stop production container
- `./scripts/dev.sh clean` - Clean up all containers and images
- `./scripts/setup.sh` - Initial project setup script

## Code Architecture

### Data-Driven Tournament Website
The site uses a static data-driven approach where tournament information is stored in JSON files and rendered through typed interfaces:

- **Data Sources**: `src/data/teams.json` and `src/data/matches.json` contain all tournament data
- **Type Safety**: Complete TypeScript type definitions in `src/types/` ensure data consistency
- **Component Architecture**: Astro components handle presentation with minimal client-side JavaScript

### Directory Structure
```
src/
├── components/          # Reusable Astro components
│   ├── StandingsTable.astro    # Tournament standings display
│   ├── TeamCard.astro          # Individual team information
│   ├── Header.astro            # Site navigation
│   └── Footer.astro            # Site footer
├── data/               # Static tournament data (JSON)
│   ├── teams.json      # Team rosters, coaches, player info
│   └── matches.json    # Match schedule, results, standings
├── types/              # TypeScript type definitions
│   ├── teams.ts        # Team, player, coach interfaces
│   ├── matches.ts      # Match, tournament schedule types
│   ├── common.ts       # Shared utility types
│   └── index.ts        # Type re-exports
├── layouts/
│   └── Layout.astro    # Base page layout
└── pages/
    └── index.astro     # Main tournament page
```

### Type System Architecture
The project uses a comprehensive type system that models the tournament structure:

- **Team Types**: `Team`, `Player`, `Coach` with role definitions (`PlayerRole`, `CoachRole`)
- **Tournament Structure**: Two divisions (CORE/NEXT) with different rank requirements
- **Match System**: Typed match states (`MatchStatus`), results, and playoff structures
- **Component Props**: Strongly typed props for all Astro components

### Data Flow Pattern
1. JSON data files serve as the single source of truth
2. TypeScript interfaces validate data structure at build time
3. Astro components consume typed data through imports
4. Build-time rendering generates static HTML with embedded data

## Development Patterns

### Configuration and Build Setup
- **Framework**: Astro v4.15.9 with static output mode
- **Styling**: Tailwind CSS with @tailwindcss/typography
- **Server**: Development server runs on host 0.0.0.0:4321 for container compatibility
- **Build Assets**: Assets are organized in `/assets` directory during build
- **Node Adapter**: Configured with standalone mode for container deployment

### Path Aliases
The project uses TypeScript path mapping for clean imports:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/types/*` → `./src/types/*`
- `@/data/*` → `./src/data/*`

### Tournament Data Updates
To update tournament information:
1. Edit `src/data/teams.json` for roster changes
2. Edit `src/data/matches.json` for schedule/results
3. Update type definitions in `src/types/` if schema changes
4. Run `pnpm check` to validate types
5. Rebuild with `pnpm build`

### Component Development
- Use Astro's component syntax with TypeScript
- Import types from `@/types` for prop validation
- Follow existing naming patterns (PascalCase for components)
- Maintain type safety for all data access

### Container Development
The project supports both traditional Node.js development and containerized development:
- Multi-stage Dockerfile with development and production targets
- Podman-first approach with Docker compatibility
- Volume mounting for development with live reload
- Production build uses Alpine Linux with Nginx

## Quality Assurance

### Type Checking
Always run `pnpm check` before committing changes. The build process includes automatic type checking via `astro check && astro build`.

### Linting
Run `pnpm lint` to check code quality. ESLint is configured for Astro and TypeScript files.

### Testing Development Server
Use `curl http://localhost:4321` to verify the development server is responding correctly.

## Deployment

### Netlify Deployment (Production)

**Current Production Site**: https://ltk-fansite.netlify.app

#### Netlify Configuration
```
Project Name: ltk-fansite
Build Command: pnpm build
Publish Directory: dist
Branch: main
Node.js Version: 18.x
```

#### Required Settings
- **Build Command**: `pnpm build` (NOT "echo 'No build process needed'")
- **Publish Directory**: `dist` (NOT ".")
- **Node.js Version**: Set environment variable `NODE_VERSION=18`
- **PNPM Support**: Automatically detected via `netlify.toml`

#### Manual Deployment Process
1. Ensure all changes are committed to `main` branch
2. Push to GitHub repository
3. Netlify automatically rebuilds and deploys
4. Site available at https://ltk-fansite.netlify.app

#### Troubleshooting Deployment Issues
- **Build fails**: Check that `pnpm build` works locally
- **Static assets missing**: Verify `publish = "dist"` in `netlify.toml`
- **Styling broken**: Ensure Tailwind CSS builds correctly
- **Type errors**: Run `pnpm check` before deployment

### Other Deployment Options

The site builds to static files suitable for any static hosting service. The README.md contains detailed deployment instructions for various platforms (Vercel, GitHub Pages, etc.).

Production builds are optimized with:
- Static site generation
- Scoped CSS with minimal runtime overhead  
- TypeScript compilation
- Asset optimization