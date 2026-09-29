# ADR-0003: Zod schemas are the single source of truth for API shapes

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The frontend and backend need to agree on request bodies, response payloads, and their TypeScript types. Two things I want to avoid:

1. Hand-written TS interfaces on the frontend that drift silently from what the backend actually returns.
2. Duplicated definitions in two packages that have to be manually kept in sync.

I also want *runtime* validation at the API's public edges — a bug on the client shouldn't be able to produce a garbage row in the database, and a schema change on the server shouldn't crash the client with a cryptic TypeError three functions deep.

## Decision

Define every cross-boundary shape as a Zod schema in `packages/shared`. Derive TypeScript types from those schemas with `z.infer`.

- **API side:** validate `req.params` and `req.body` with the shared schema in middleware before the controller ever runs (`apps/api/src/middleware/validate.ts`).
- **Client side:** parse every response through the shared schema (`schema.parse(await response.json())`) before handing it to callers.
- **Types:** consumers never write interfaces by hand; they do `z.infer<typeof someSchema>` or import the exported type alias.

## Alternatives considered

- **Hand-written TS interfaces shared as types-only** — zero runtime cost, but no runtime validation. A stale client crashing on a schema change is a nightmare to debug.
- **OpenAPI + code generation** — the "industrial" answer; great for large teams and polyglot backends. Heavy toolchain overhead for a solo TypeScript project. Might revisit if the API ever needs non-TS clients.
- **tRPC** — solves the same problem more automatically, but see [ADR-0002](0002-separate-express-api.md) — I explicitly want the HTTP contract to be visible.

## Consequences

- **Good:** One place to change a shape. TS errors on both apps will show me every call site that needs updating.
- **Good:** Malformed data is rejected at the boundary with structured 400s (see `validate.ts`) — controllers can trust their inputs.
- **Good:** Every schema doubles as free API documentation.
- **Cost:** A tiny runtime cost on every request/response for parsing. Negligible at this scale; would matter for very high-throughput endpoints (revisit only when measured).
- **Cost:** Two "layers" of validation feels redundant on the happy path — but it's the redundancy that makes each side robust to the other changing.
- **Cost:** Express 5 makes `req.query` a getter, so the current `validate.ts` handles params and body but not query. Documented in the file; will address when a route needs it.

## Related

- [ADR-0001](0001-pnpm-workspaces-monorepo.md) — shared package layout
- Code: `packages/shared/src/index.ts`, `apps/api/src/middleware/validate.ts`, `apps/web/src/lib/api.ts`
