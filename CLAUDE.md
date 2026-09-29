# Habitat — working notes for Claude

Habitat is a **learning-and-portfolio project**, not a product-in-a-hurry. The person building it (Dewey) is a strong mobile engineer sharpening web/TypeScript fundamentals and preparing for interviews. That framing changes how you should collaborate on this repo.

## What matters here

- **Understanding beats velocity.** Dewey wants to be able to *talk* about every part of this system. If he doesn't understand something, we've regressed no matter how much code got written.
- **Interview-worthy patterns over impressive-looking features.** Auth, testing, observability, background jobs, real-time, and system-design tradeoffs are the point. Features exist to motivate those.
- **Real product feel is a long-term goal, not a shortcut.** Don't reach for it by scaffolding infrastructure ahead of a feature that needs it.

## How to work in this repo

1. **Explain before you write.** For anything non-trivial (a new pattern, a new dependency, a new architectural piece), walk Dewey through the approach and the alternatives *before* writing code. He'll say "go" when he's ready.
2. **Prefer small edits Dewey can hand-write himself.** When a change is small and educational (a hook, a controller, a schema), offer to describe it and let him type it. When he does ask you to write it, keep the diff small and self-contained so he can read it in one sitting.
3. **Don't add features he didn't ask for.** No incidental refactors, no "while I was in here" cleanups, no scaffolding for hypothetical future needs. If you notice something worth doing, mention it; don't do it.
4. **Don't add dependencies without asking.** New npm packages, new services, new tools all deserve a moment of "do we actually want this?" first.
5. **Document decisions as you go.** When we make a real choice (framework, pattern, boundary), an ADR belongs in `docs/adr/`. For learning entries in `docs/learning/`, Dewey prefers to *paraphrase* the reasoning back in conversation rather than write docs by hand — treat that paraphrase as the checkpoint, and correct small imprecisions (schema vs type, compile-time vs runtime, etc.) instead of letting them slide. When you do write a `learning/` entry, mark it as a draft archive of the reasoning, not something he has to rewrite.
6. **Match the existing patterns.** Route → validation middleware → controller → service → prisma on the API. Zod schemas as the source of truth in `packages/shared`. TanStack Query for server state on the frontend. If a new feature would break these patterns, that's an ADR conversation, not a silent departure.

## The stack (as of 2026-09-27)

- **Monorepo:** pnpm workspaces. `apps/web`, `apps/api`, `packages/shared`.
- **Backend:** Express 5 + Prisma 6 + PostgreSQL (Docker for local). Zod validation at the API edge.
- **Frontend:** Vite + React 19 + React Router 7. TanStack Query for server state. Tailwind v4 + shadcn/ui (base-nova) + Base UI primitives.
- **Type sharing:** Zod schemas in `@habitat/shared`, TS types derived via `z.infer`.

Detailed rationale for each choice lives in `docs/adr/`. Read those before proposing a change that would move against one of them.

## Where things live

```
apps/api/src/
  routes/         URL shape + middleware wiring
  controllers/    HTTP glue — thin, trusts validated inputs
  services/       Business logic + Prisma calls
  schemas/        Route-local Zod schemas (params, etc.)
  middleware/     validate, error-handler
  lib/            prisma client
  config/         env (Zod-validated)
apps/web/src/
  app/            App shell (routing, providers)
  routes/         Page components
  components/     Feature components + ui/ (shadcn-generated)
  lib/            api client, utils
packages/shared/  Cross-boundary Zod schemas + inferred types
docs/
  adr/            Architecture Decision Records
  learning/       Dewey's learning journal
```

## Commands

- `pnpm dev` — web + api concurrently
- `pnpm typecheck` — both packages
- `pnpm lint`
- `pnpm db:up` / `pnpm db:down` — Postgres via Docker
- `pnpm db:generate` / `pnpm db:migrate` — Prisma

## Anti-goals

- Don't reach for Next.js, tRPC, Turborepo, or similar "upgrade" moves unless Dewey brings it up. Each was consciously deferred (see ADRs).
- Don't add global state libraries. Client state is `useState`; server state is TanStack Query.
- Don't touch auth patterns unilaterally — the `User` model has a plaintext password field as a placeholder; Firebase Auth is the planned direction. Wait until that's designed.
