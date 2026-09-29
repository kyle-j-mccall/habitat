# ADR-0004: Use TanStack Query for server state on the frontend

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The frontend needs to read from and write to the API, and I want the usual quality-of-life behaviors: caching, background refetch, deduplication of concurrent requests, invalidation after a mutation, loading and error states. Doing this by hand with `useState` + `useEffect` gets ugly fast, and the ugliness scales poorly.

I also want to internalize the *distinction* between **server state** (owned by the backend, cached on the client) and **client state** (UI-only — form drafts, modals open, etc.). Conflating them is one of the most common React mistakes.

## Decision

Adopt [`@tanstack/react-query`](https://tanstack.com/query) as the sole owner of server state. `QueryClient` is provided at the app root (`apps/web/src/app/providers.tsx`). All API reads go through `useQuery`; all writes go through `useMutation` and invalidate the affected queries on success.

Client state stays in `useState` / component-local reducers. No global state library.

## Alternatives considered

- **Plain `useEffect` + `fetch`** — a common self-inflicted wound. Handles the trivial case; falls apart at refetch, caching, race conditions, and stale-while-revalidate. Not worth the trap.
- **Redux Toolkit + RTK Query** — RTK Query is fine and comparable, but Redux Toolkit carries a lot of surface area I don't need for local UI state. TanStack Query lets me keep client state simple.
- **SWR** — the closest peer to TanStack Query. Both are good. TanStack Query has richer mutation/invalidation ergonomics and better devtools; the ecosystem is bigger.
- **Server Components + `use` / server actions** — the modern Next.js answer, but requires Next.js. Deferred by [ADR-0002](0002-separate-express-api.md).

## Consequences

- **Good:** Loading/error/success states become declarative and consistent across every screen.
- **Good:** Mutation → invalidate is a clean, teachable pattern (and a great interview talking point about cache invalidation).
- **Good:** DevTools make cache state legible, which is educational on its own.
- **Cost:** Another concept to learn — query keys, `staleTime`, `gcTime`. Worth it; these ideas transfer to any caching system.
- **Cost:** Cache invalidation is genuinely one of the two hard things. Getting it wrong causes subtle bugs. Requires discipline: after every mutation, ask "what did this invalidate?"

## Related

- [ADR-0002](0002-separate-express-api.md) — separate API means we need a real client-side data layer
- Code: `apps/web/src/app/providers.tsx`, `apps/web/src/lib/api.ts`
