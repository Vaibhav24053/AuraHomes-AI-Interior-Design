# AuraHome

An editorial AI interior-design platform helping people in India discover and shape homes that feel unmistakably theirs.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/aurahome/src/App.tsx` — landing page, shared navigation, reusable reveal/count-up/comparison interactions, and placeholder routes
- `artifacts/aurahome/src/index.css` — AuraHome visual system, typography, color tokens, motion, grain, and responsive styles
- `artifacts/api-server` — shared Express API scaffold; AuraHome's first pass is intentionally frontend-only

## Architecture decisions

- AuraHome is a presentation-first frontend in this pass; no AI or database calls are wired until the core product flows are designed.
- Wouter provides the lightweight route shell so the marketing experience and placeholder product paths share one app.
- The before/after comparison and count-up metrics are local interactions with reduced-motion support.

## Product

The first pass introduces AuraHome's visual identity and landing experience: AI-powered room transformation, style discovery, Vastu-aware redesign, AR previews, INR sourcing, community, and responsive placeholder destinations for each product area.

## User preferences

The user requested a warm, editorial Indian-market experience with restrained category colors, soft motion, and no real backend logic in the first pass.

## Gotchas

Use the artifact workflow for the web app; its Vite server requires the workflow-provided `PORT` and `BASE_PATH` values.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
