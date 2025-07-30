# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based static website for the LTK (League The k4sen) 2025 tournament - a League of Legends streamers championship. The site displays tournament information, team rosters, match schedules, and standings for a 4-team tournament featuring Japanese streamers.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server on http://localhost:4321 with hot reload (host 0.0.0.0)
- `pnpm start` - Alternative development server command (same as dev)
- `pnpm build` - Build static site for production (standard build without type checking)
- `pnpm build:check` - Build with type checking via `astro check && astro build`
- `pnpm preview` - Preview production build locally (host 0.0.0.0)
- `pnpm check` - Run TypeScript type checking only via `astro check`
- `pnpm lint` - Run ESLint for Astro, TypeScript, and TSX files in src directory

### Testing Commands
- `pnpm playwright test` - Run all Playwright tests for visual regression and layout validation
- `pnpm playwright test --grep "responsive"` - Run only responsive behavior tests
- `pnpm playwright test --ui` - Run tests in interactive UI mode
- `pnpm exec playwright show-report` - View detailed HTML test report after test execution

### Domain Management Commands
- `pnpm domain:setup` - Configure custom domain setup for deployment
- `pnpm domain:status` - Check domain configuration and DNS status

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

### Data-Driven Tournament Website with Advanced Statistics
The site uses a static data-driven approach where tournament information is stored in JSON files and rendered through typed interfaces:

- **Primary Data Sources**: `src/data/ltk-sbb-teams.json` and `src/data/ltk-sbb-matches.json` contain core tournament data
- **Enhanced Match Data**: `src/data/enhanced-matches.json` contains matches with detailed player statistics  
- **Comprehensive Statistics**: `src/data/detailed-match-stats.json` (860KB) with processed player/team/champion analytics
- **Statistics Page**: Dedicated `/statistics` route with comprehensive tournament analysis
- **Type Safety**: Complete TypeScript type definitions in `src/types/` and `src/types/statistics.ts` ensure data consistency
- **Component Architecture**: Astro components handle presentation with minimal client-side JavaScript

### Directory Structure
```
src/
├── components/          # Reusable Astro components
│   ├── StandingsTable.astro       # Tournament standings display
│   ├── CombinedStandingsTable.astro # Combined CORE/NEXT standings
│   ├── TeamCard.astro             # Individual team information
│   ├── BanPickDisplay.astro       # League of Legends draft information (bans/picks)
│   ├── PlayerStatsTable.astro     # Comprehensive player statistics table
│   ├── TeamPerformanceChart.astro # Team performance analysis with charts
│   ├── ChampionAnalytics.astro    # Champion meta analysis and pick/ban rates
│   ├── MatchInsightsPanel.astro   # Detailed match analysis and insights
│   ├── Header.astro               # Site navigation with statistics page link
│   └── Footer.astro               # Site footer
├── data/               # Static tournament data (JSON)
│   ├── ltk-sbb-teams.json         # Team rosters, coaches, player info
│   ├── ltk-sbb-matches.json       # Match schedule, results, standings
│   ├── enhanced-matches.json      # Matches enhanced with detailed player stats
│   ├── detailed-match-stats.json  # Comprehensive statistics (860KB processed data)
│   └── match_results.json         # Raw match results for data processing
├── types/              # TypeScript type definitions
│   ├── teams.ts        # Team, player, coach interfaces
│   ├── matches.ts      # Match, tournament schedule types
│   ├── statistics.ts   # Comprehensive statistics interfaces (20+ types)
│   ├── common.ts       # Shared utility types
│   └── index.ts        # Type re-exports
├── utils/              # Utility functions
│   └── matchDataTransform.ts     # Data transformation utilities for statistics
├── layouts/
│   └── Layout.astro    # Base page layout with SEO optimization
└── pages/
    ├── index.astro     # Main tournament page
    └── statistics.astro # Comprehensive statistics page with tabbed interface
```

### Type System Architecture
The project uses a comprehensive type system that models the tournament structure:

- **Team Types**: `Team`, `Player`, `Coach` with role definitions (`PlayerRole`, `CoachRole`)
- **Tournament Structure**: Two divisions (CORE/NEXT) with different rank requirements
- **Match System**: Typed match states (`MatchStatus`), results, and playoff structures
- **League of Legends Integration**: `ChampionDraft` interface for ban/pick data with team-specific bans and picks
- **Advanced Statistics**: 20+ interfaces in `statistics.ts` covering player stats, team performance, champion analytics, match insights
- **Data Transformation**: Utilities in `matchDataTransform.ts` with team name mapping and statistical processing
- **Component Props**: Strongly typed props for all Astro components

### Data Flow Pattern
1. **Primary Data**: JSON data files (`ltk-sbb-teams.json`, `ltk-sbb-matches.json`) serve as the single source of truth
2. **Data Enhancement**: `matchDataTransform.ts` processes raw match results into enhanced statistics
3. **Statistical Processing**: Comprehensive data transformation creates `detailed-match-stats.json` with 860KB of processed analytics
4. **Type Validation**: TypeScript interfaces validate data structure at build time
5. **Component Consumption**: Astro components consume typed data through imports with full type safety
6. **Static Generation**: Build-time rendering generates static HTML with embedded data
7. **Statistics Presentation**: Dedicated statistics page presents processed data through specialized components

## Development Patterns

### Configuration and Build Setup
- **Framework**: Astro v4.15.9 with static output mode
- **Styling**: Tailwind CSS with @tailwindcss/typography, soft color palette design system
- **Server**: Development server runs on host 0.0.0.0:4321 for container compatibility
- **Build Assets**: Assets are organized in `/assets` directory during build
- **Testing**: Playwright v1.54.1 for visual regression and responsive design validation

### League of Legends Integration
The site includes comprehensive LoL tournament features:
- **Ban/Pick Display**: `BanPickDisplay.astro` component shows champion drafts with team-specific bans and picks
- **Champion Data**: Match results can include `draft` objects with ban and pick information  
- **Responsive Design**: Ban/pick containers are optimized for mobile viewports with overflow protection
- **Visual Design**: Champion tags include pick order indicators and team-specific styling

### Path Aliases
The project uses TypeScript path mapping for clean imports:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/types/*` → `./src/types/*`
- `@/data/*` → `./src/data/*`

### Tournament Data Updates
To update tournament information:
1. Edit `src/data/ltk-sbb-teams.json` for roster changes
2. Edit `src/data/ltk-sbb-matches.json` for schedule/results and ban/pick data
3. **For Advanced Statistics**: Use `matchDataTransform.ts` utilities to process raw match data into enhanced statistics
4. Update type definitions in `src/types/` if schema changes (especially `statistics.ts` for new metrics)
5. Run `pnpm check` to validate types across all files including statistics components
6. Run `pnpm playwright test` to ensure responsive design compliance
7. Rebuild with `pnpm build`

### Data Processing Workflow
When adding new match results with detailed player statistics:
1. Add raw match data to `match_results.json` (if available)
2. Use transformation utilities in `matchDataTransform.ts` to process data
3. Update `enhanced-matches.json` with enhanced match data
4. Regenerate `detailed-match-stats.json` with comprehensive statistics
5. Verify statistics page displays correctly at `/statistics`

### Adding Ban/Pick Data to Matches
To add League of Legends draft information to match results:
1. Add a `draft` property to the match `result` object in `src/data/ltk-sbb-matches.json`
2. Include `bans.team1` and `bans.team2` arrays with champion names
3. Include `picks.team1` and `picks.team2` arrays with champion names in pick order
4. The `BanPickDisplay` component will automatically render the draft information

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

### Visual Regression Testing
The project uses Playwright for comprehensive visual testing:
- **Layout Validation**: Tests ensure components don't overflow containers, especially on mobile viewports
- **Responsive Behavior**: Automated testing across mobile (375px), tablet (768px), and desktop (1920px) viewports
- **Screenshot Comparison**: Visual regression detection with automated screenshot capture
- **Configuration**: Tests run against preview server (`pnpm preview`) on http://localhost:4321

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