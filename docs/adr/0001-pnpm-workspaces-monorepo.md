# ADR-0001: Use a pnpm workspaces monorepo

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Habitat has two runtime surfaces from day one — a Vite/React frontend and an Express API — and they need to agree on shapes (request bodies, response payloads, IDs). I want to share Zod schemas and derived TypeScript types between them without publishing an npm package or copy-pasting types.

## Decision

Adopt a pnpm workspaces monorepo with three packages:

- `apps/web` — the React frontend
- `apps/api` — the Express API
- `packages/shared` — Zod schemas and shared types, consumed as `@habitat/shared` (workspace protocol)

pnpm is the package manager, chosen for its content-addressed store (fast installs) and first-class workspace protocol.

## Alternatives considered

- **Two separate repos with a published shared package** — closest to real production separation, but adds versioning overhead and cross-repo PRs for a solo project. Not worth the friction yet.
- **Single-app Next.js project (API routes + frontend together)** — simpler, but I want to *feel* the frontend/backend boundary rather than let a framework hide it. Interview conversations about client/server contracts benefit from that separation.
- **Turborepo / Nx** — mature monorepo tooling with task caching and pipelines. Overkill for two apps; I'd rather add it later once I feel the pain it solves than adopt it prematurely.

## Consequences

- **Good:** One `pnpm install`, one lockfile, one place to run typecheck. Shared package edits are picked up instantly without a build step.
- **Good:** The Zod-schemas-as-source-of-truth pattern (see ADR-0003) becomes trivial to enforce — both apps import from the same file.
- **Cost:** New contributors need to know pnpm and workspace basics. Fine for a solo project; something to remember if I onboard anyone.
- **Cost:** No task orchestration or caching yet. If build/typecheck times get slow, revisit Turborepo.

## Related

- [ADR-0002](0002-separate-express-api.md) — separate Express API rather than Next.js API routes
- [ADR-0003](0003-zod-schemas-source-of-truth.md) — Zod as source of truth for schemas and types
