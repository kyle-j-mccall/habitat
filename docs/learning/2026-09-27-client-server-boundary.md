# The client/server boundary — Zod at the wire, and why the wire is worth seeing

*Date: 2026-09-27*

> **Draft note.** This entry was drafted by Claude from a conversation and captures the reasoning verbatim. Rewrite it in my own voice — that's where the learning sticks. The structure and points below are what to *keep*; the prose is scaffolding.

## What triggered this

Reviewing ADR-0002 and ADR-0003 raised two related questions:

1. How do the shared Zod schemas actually get used on both sides of the wire?
2. What did the ADRs mean by Next.js "blurring the boundary" and tRPC "collapsing the HTTP contract into a language-level abstraction"?

Realized these are the same topic wearing different clothes. Both are about the **boundary between client and server** — where it is, whether it's visible, and what you get by keeping it explicit.

---

## Part 1: Zod schemas at the boundary

### A schema wears two hats

A schema like `createAnimalBody` is two things at once:

- **A runtime value.** A real JS object with a `.parse()` method. Exists in the compiled bundle. Inspects data at runtime.
- **A type source.** `z.infer<typeof createAnimalBody>` gives me a TS type. Compile-time only; erased from the output JS.

Both derived from one declaration. That's what keeps client and server in sync — edit the schema, both faces update in lockstep.

### There are two schemas because there are two directions

| Direction | Schema | What it says |
|---|---|---|
| Client → Server (request body) | `createAnimalBody` | The shape the client is allowed to send |
| Server → Client (response body) | `animalSchema` / `animalListSchema` | The shape the server promises to return |

They're not the same shape. The response has `id`, joined `species`, joined `enclosure` — fields the caller couldn't have known about. Input shape ≠ output shape. Normal REST convention.

### Two classes of bug, two defenses

- **Compile-time type** catches *my own* bugs — forgetting a field, wrong shape at a call site. Runs in `tsc`. Free at runtime (types compile away).
- **Runtime `.parse()`** catches *external* bugs — malformed request from a client, outdated response from a server, someone poking curl at the API. Runs on real bytes.

They're not redundant. Each catches something the other can't.

### Where `.parse()` actually runs

A "trust boundary" is where untrusted bytes become typed data. There are two in this app:

- **API side:** middleware calls `.parse()` on `req.params` and `req.body` before the controller runs. From the controller down, inputs are trusted.
- **Client side:** `apps/web/src/lib/api.ts` runs `.parse()` on every response before returning to callers. From there down, `Animal[]` is trusted to actually be `Animal[]`.

### Gotcha in the current code

`validateParams` runs on the GET `:id` routes, but `validateBody` **isn't wired up on the POST routes**. The controller's `Request<..., ..., z.infer<typeof createAnimalBody>>` generic is a *compile-time promise* — TypeScript trusts it. At runtime, nothing is checking. A curl `POST /animals -d '{"name": 42, "speciesId": "banana"}'` would sail past validation and blow up somewhere inside Prisma with a cryptic error.

**Muscle memory:** TypeScript will happily lie to me if the runtime isn't actually enforcing what the types claim.

Fix is a one-liner per POST route: `animalsRouter.post('/', validateBody(createAnimalBody), postAnimal)`.

---

## Part 2: How much of the boundary is visible

Given three ways to build a full-stack TypeScript app, how visible is the wire?

### React (Vite) + Express — what this project does

```ts
// client
await fetch(`${apiUrl}/animals`, { method: 'POST', body: JSON.stringify(input) });
```

```ts
// server
animalsRouter.post('/', postAnimal);  // res.status(201).json(animal)
```

Visible: URL, verb, status code, JSON payload in devtools, CORS config. Two processes, two mental models, an explicit contract between them.

### Next.js App Router (Server Components + Server Actions)

Server Components:

```tsx
async function AnimalsPage() {
  const animals = await db.animal.findMany();  // runs on the server
  return <AnimalList animals={animals} />;
}
```

No `fetch`, no URL, no verb, no status. The function runs on a different *machine* than the component that displays the data — but the syntax hides that.

Server Actions:

```tsx
async function createAnimal(formData: FormData) {
  "use server";
  await db.animal.create({ data: {...} });
}
<form action={createAnimal}>...</form>
```

Looks like a local function call. Actually an RPC. The `"use server"` directive is the whole boundary.

Great for productivity. Hides:

- Wire format
- HTTP verbs and status codes
- The "two programs talking" mental model that maps to distributed systems, mobile-with-a-backend, microservices, third-party API integrations

### tRPC

```ts
// server
router({ getAnimals: publicProcedure.query(async () => ...) })
// client
trpc.getAnimals.useQuery()
```

End-to-end typed. Genuinely delightful DX. But I never design:

- URLs — one endpoint under the hood, `/api/trpc/[procedure]`
- Verbs — `query` and `mutation` are TypeScript-level distinctions, not really HTTP
- Status codes — tRPC has its own error taxonomy
- Idempotency semantics

The interface is expressed as a **TypeScript function signature**, not an **HTTP verb on a URL**. That's what "language-level abstraction" means — the contract lives in TS, not in HTTP.

---

## Part 3: Why explicit-first, for now

REST — meaning HTTP verbs, status codes, resource URLs, idempotency, caching semantics — is:

- **Universal.** Any HTTP client can hit it: a mobile app, curl, another language. A tRPC API is fundamentally a TS API.
- **The vocabulary of the industry.** Interviews ask about status codes, verbs, URL design, idempotency, cache-control. Those aren't tRPC concepts; they're HTTP concepts.
- **What everything is built on.** Server actions, tRPC — all HTTP underneath. Understanding what's under the abstraction makes the abstraction comprehensible instead of magical.

Same pattern as recursion before generators, SQL before ORMs, C before Rust. The sugar is nice but isn't a substitute for the fundamentals it's abstracting.

**None of this means Next.js or tRPC are wrong choices.** For a real product, they're often the right call. The claim is narrower: for someone deliberately learning fundamentals, the more explicit split teaches more per unit of code written. When I later revisit these tools, I'll appreciate what they hide precisely *because* I understood it directly first.

---

## Worked example: `animalListSchema` and when a type earns its keep

Reinforcing the same pattern from a slightly different angle. In `packages/shared/src/index.ts`:

```ts
export const animalSchema = z.object({ id, name, species, enclosure, ... });
export const animalListSchema = z.array(animalSchema);
export type Animal = z.infer<typeof animalSchema>;
// intentionally no exported AnimalList type
```

Notice the asymmetry: `animalSchema` gets both a schema *and* a derived type (`Animal`). `animalListSchema` only gets a schema — no `AnimalList` type. Is that a gap?

No. It's the pattern working correctly. Here's why.

### `Animal[]` vs. `AnimalList`

`Animal[]` and `z.infer<typeof animalListSchema>` are **structurally identical** — TypeScript treats them the same. Adding a named alias `AnimalList` would give me nothing new functionally. And `Animal[]` reads *more* clearly than `AnimalList` because there's no jump-to-definition step; the reader instantly knows what it is.

Rule of thumb: **name a type when it has structural nuance beyond obvious composition.** `Animal[]` is obvious composition. `PaginatedAnimalResponse = { items: Animal[]; total: number; cursor: string | null }` has nuance and earns a name. Right now, the list is just an array. When the API adds pagination or filtering metadata, the schema will grow into an object, and *then* the derived type will earn a name.

### Schemas and types don't have to be 1:1

This is the sticky idea. They serve different jobs:

| Layer | What it's for | When it needs a name |
|---|---|---|
| **Schema (runtime)** | Validating data at trust boundaries with `.parse()` | Always — someone has to call `.parse()` on it |
| **Type (compile-time)** | Describing shapes to the TS compiler | Only when the shape can't be expressed trivially with existing types |

So every schema needs to be exported. Not every schema needs a corresponding exported type. `animalListSchema` needs to exist because `fetchAnimals` calls `.parse()` on it to validate the API response. `AnimalList` doesn't need to exist because `Animal[]` already tells TypeScript everything it needs to know.

### Where I'd write it if I had to

If `AnimalList` ever earns its keep, the pattern is the same as `Animal`:

```ts
export type AnimalList = z.infer<typeof animalListSchema>;
```

That derivation is what keeps schema and type locked in sync. The moment I need the type, that one line brings it into existence — no hand-written interface, no risk of drift.

### The lesson underneath

- **Schema first, type as needed.** The schema is the source of truth. Types are cheap views into it; only create the ones that add clarity.
- **Two roles, one source.** `animalSchema` is used by `.parse()` at runtime *and* by `z.infer` at compile time. Same declaration, different consumers.
- **Compile-time and runtime are separate concerns.** TypeScript is confident about `Animal[]` because I told the compiler `fetchAnimals` returns `Promise<Animal[]>`. The runtime is confident because `.parse()` actually inspects the bytes. Both required; neither optional.

---

## What I want to remember

- The client/server boundary is *a thing I design*, not a framework detail.
- Zod schemas are the artifact that makes the contract explicit and shared.
- TS types are compile-time only; `.parse()` is where runtime protection actually happens.
- Two classes of bug (internal, external), two defenses (compile-time types, runtime validation) — both required.
- Schemas and types don't have to be 1:1 — every schema needs to exist for runtime validation, but only some deserve a named type at compile time.
- Every abstraction that hides the boundary (Server Actions, tRPC, framework-magic RPC) is doing work I can now name.
