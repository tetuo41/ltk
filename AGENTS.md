# Repository Guidelines

## Project Structure & Module Organization
The Astro app lives in `src/`, grouped by purpose: UI in `src/components`, layout shells in `src/layouts`, routed pages and API handlers in `src/pages`, shared helpers in `src/utils`, and typed models in `src/types`. Tournament and video fixtures are under `src/data`; keep large data diffs isolated there. Static assets belong in `public/`. End-to-end specs sit in `tests/`, and operational scripts live in `scripts/` (for example `scripts/setup-domain.sh`).

## Build, Test & Development Commands
Install dependencies with `pnpm install`. Use `pnpm dev` for local work (served on http://localhost:4321) and `pnpm preview` to inspect a production build. Ship builds with `pnpm build` or `pnpm build:check` when you want type-checking enforced. Run `pnpm check` for the Astro/TypeScript diagnostics pass, `pnpm lint` to invoke ESLint on `.astro/.ts/.tsx`, and `pnpm playwright test` for Playwright coverage; append `--ui` when debugging a single spec.

## Coding Style & Naming
Code is TypeScript-first with `strict` mode enabled (see `tsconfig.json`). Prefer two-space indentation, keep imports ordered (Astro, components, utils) and rely on `@/` path aliases for intra-project references. Astro components and TypeScript types use PascalCase (`TeamCard.astro`, `MatchResult`), utilities use camelCase, and Tailwind utility classes should stay in logical groupings (layout → spacing → color). Before pushing, ensure `pnpm lint` passes; no automated formatter runs in CI.

## Testing Guidelines
Automation relies on Playwright. Place new specs next to similar flows under `tests/` using the `*.spec.ts` suffix and descriptive names (`clips-admin.spec.ts`). Run `pnpm playwright test` to cover the suite or target a scenario with `--grep`. When modifying UI layouts, capture Playwright screenshots locally and attach them to the PR if diffs are significant.

## Commit & Pull Request Guidelines
Follow Conventional Commit verbs (`feat`, `fix`, `chore`, `refactor`) that mirror existing history (`feat: implement comprehensive YouTube integration for clips page`). Keep messages imperative and scoped. For pull requests, include a concise summary, list testing evidence (`pnpm build:check`, `pnpm playwright test`), and link related issues. UI-affecting work should include before/after visuals; backend or data updates must call out any required `.env` tweaks.

## Environment & Configuration
Copy `.env.example` to `.env` and populate keys such as `YOUTUBE_API_KEY` and `ADMIN_PASSWORD`. Local data updates feed into scheduled GitHub Actions (`.github/workflows/update-videos.yml`), so note when manual runs are needed. For domain checks, use the bundled helpers: `pnpm domain:setup` and `pnpm domain:status`.
