# ADR-0002: Use a separate Express API instead of Next.js API routes

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

I need a backend. The dominant "just start building" path for a React app in 2026 is Next.js with server components and route handlers — but that blurs the client/server boundary. Given the goals for this project (learning, interview prep, system design fluency), I want to *see* the boundary clearly and be able to talk about the concerns on each side of it.

## Decision

Ship the backend as its own Express 5 app in `apps/api`, running on its own port, talking to the frontend over HTTP + JSON. The frontend (`apps/web`) is a plain Vite SPA and knows nothing about the API's implementation.

Backend layering:

```
route → validation middleware (Zod) → controller → service → prisma
```

The controller is deliberately dumb: by the time it runs, params/body are already parsed and typed. Services hold business logic; controllers translate between HTTP and services.

## Alternatives considered

- **Next.js App Router with route handlers** — one framework, one deploy target, RSC. Great production choice, but hides the client/server split I want to practice reasoning about. Also less useful for interview stories about API design as a discipline.
- **Fastify** — faster than Express, opinionated plugin model, first-class TS. Legitimately better on the technical merits. Chose Express because it's the vocabulary in most job postings; I'd rather deeply understand what everyone uses than optimize for benchmarks. Revisit if perf becomes real.
- **tRPC** — end-to-end typed calls with no manual schema wiring. Genuinely elegant, but it collapses the HTTP contract into a language-level abstraction. I want to practice thinking in HTTP verbs, status codes, and REST-shaped resources first.

## Consequences

- **Good:** Explicit HTTP contract. Every endpoint has a URL, verb, status, body shape — the vocabulary interviewers use.
- **Good:** Frontend is swappable. I could rewrite `apps/web` in Svelte or React Native tomorrow and the API wouldn't care.
- **Good:** The route → controller → service split is a clean example of separation of concerns; each layer has one job.
- **Cost:** Two processes to run in dev. Handled by `concurrently` in the root `dev` script.
- **Cost:** CORS is now a real concern. Configured via `CORS_ORIGIN` env.
- **Cost:** Manual work to keep client and server in sync on shapes. Mitigated by [ADR-0003](0003-zod-schemas-source-of-truth.md).

## Related

- [ADR-0001](0001-pnpm-workspaces-monorepo.md) — monorepo layout
- [ADR-0003](0003-zod-schemas-source-of-truth.md) — schema sharing across the HTTP boundary
