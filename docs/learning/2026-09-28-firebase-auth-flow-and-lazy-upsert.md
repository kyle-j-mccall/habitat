# Firebase Auth flow and the lazy DbUser upsert

*Date: 2026-09-28*

> **Draft note.** Captured from a conversation. Rewrite in my own voice when I want to make it stick.

## What triggered this

Started wiring Firebase Auth for the habitat project. Had to sort out: how does the credential exchange actually work, when does my API get involved, and how does my Postgres `User` row relate to the Firebase user? These questions turned out to be the real design work — the code that came out of it was small once the model was clear.

## Two user concepts, one linkage

Two different notions of "user" coexist:

| Concept | Owner | Contains | Identity |
|---|---|---|---|
| **Firebase user** | Firebase | email, password (hashed by them), auth providers, verified flag, MFA | Firebase UID (string) |
| **DbUser** (Postgres) | My app | app-specific data (later: roles, preferences, ownership) | Auto-increment `id` (int) |

The link is `firebaseUid` — a unique string column on the DbUser table.

**Mental model:** Firebase owns "who they are." My DB owns "what they do in my app."

The schema change was small:
- Drop the `password` column (Firebase owns credentials now)
- Add `firebaseUid String @unique`
- Keep `email` denormalized (local queries don't need to hit Firebase; Firebase remains source of truth if they drift)
- Keep the int `id` as PK — portable if I ever leave Firebase, and cleaner FKs than a string UID everywhere

## The credential flow — Firebase-only

Sign-in **doesn't touch my API**. The client talks to Firebase directly:

```
[Client SDK] --email/password--> [Firebase]
[Client SDK] <--ID token--------- [Firebase]

[My API has heard nothing so far.]
```

Only after that, when the client makes actual app requests, does my API enter the picture:

```
[Client] --Authorization: Bearer <idToken>--> [My API]
[My API] --verify token--> [Firebase Admin SDK] (crypto + expiry check)
```

So the **credential** and the **token** are separate concerns. Credentials only ever move between the client and Firebase. Tokens are the currency of every subsequent API request.

## Stateless auth — no server session

Every authenticated request re-verifies the token from scratch. There is no server-side "sessions" table.

Consequences worth remembering:
- **Horizontal scaling is trivial** — any API instance can verify any token.
- **Logout is a client concern** — the client discards the token; the server has nothing to invalidate.
- **Tokens expire fast (~1 hour)** — the client SDK auto-refreshes them; my fetch wrapper just grabs the current one each time, doesn't cache one from sign-in.
- **You verify a lot** — cheap after the Admin SDK's warm cache of Firebase's public keys, but it's crypto per request conceptually.

Contrast with session cookies where sign-in creates a server-side session and every request is a session lookup. Different model, different tradeoffs.

## When `requireAuth` runs

Not on sign-in. Never on sign-in.

`requireAuth` runs on **every request to a protected endpoint** — after Firebase has already given the client a token. It's the layer where "you have a valid token" becomes "you exist in my database."

Pipeline for one authenticated request:

```
Client attaches Authorization: Bearer <idToken>
     ↓
Express routes to the endpoint
     ↓
requireAuth middleware:
   1. Extract token from header (401 if missing)
   2. adminAuth.verifyIdToken(token) — crypto verify + expiry check (401 on failure)
   3. Zod-parse the decoded claims (uid + email required)
   4. upsertUserByFirebaseUid — see below
   5. Attach the DbUser row as req.user
   6. next()
     ↓
Controller runs with req.user available
```

The Zod parse in step 3 is worth calling out: the Firebase SDK types leave `email` as `string | undefined`, so I still validate at this boundary as defense in depth. Same principle as the client/server Zod pattern — see [[client-server-boundary]] — validate at any place trusted data has to be assumed.

## Why lazy upsert (and why `upsert`, not `findOrCreate`)

Two design questions here, one call handles both.

**Lazy vs. eager creation:**
- **Lazy (chosen):** first authenticated request to my API materializes the DbUser row. Client just signs up with Firebase; my API isn't involved in signup at all.
- **Eager:** client explicitly hits `POST /users` after Firebase signup. More endpoints, more failure modes (what if the POST fails after the Firebase account is created?).

Lazy wins because it's self-healing and requires no extra client-side coordination.

**Why `prisma.user.upsert` (not find + create):**
- **Atomic.** One SQL statement (`INSERT ... ON CONFLICT DO UPDATE`). No race window where two simultaneous first-requests both see "no user" and one explodes on the unique constraint.
- **The update branch runs on every subsequent request**, which lets me keep `email` synced from Firebase's claims — a self-healing detail if the user changes their email.

Skeleton:

```ts
prisma.user.upsert({
  where:  { firebaseUid: input.firebaseUid },
  create: input,                                // full record on first sight
  update: { email: input.email },               // just refresh email on subsequent hits
});
```

The naming matters: `upsertUserByFirebaseUid` describes behavior; `createUser` would be a lie because the function is idempotent.

## What I want to remember

- Sign-in is a client↔Firebase transaction. My API is not in the loop for credentials.
- **Tokens** are the currency of the app; **credentials** are the currency of sign-in.
- `requireAuth` = every protected request, not sign-in.
- Stateless auth: no sessions, tokens are self-contained, server verifies fresh every time.
- Lazy upsert makes signup and my API cleanly independent — Firebase can have users my DB has never seen, and that's fine until they do something.
- `upsert` is the right primitive for this pattern: atomic, race-free, self-healing.
- The Zod re-parse of token claims isn't paranoia; it's the same trust-boundary principle from [[client-server-boundary]] applied to a different boundary (SDK response → my typed code).

## Interview version

> "Firebase Auth is stateless, token-based. Sign-in is a client-to-Firebase transaction; my API never sees credentials. Every subsequent request carries an ID token in the Authorization header, and my middleware verifies it via the Admin SDK, Zod-parses the claims, then upserts the corresponding Postgres user row keyed by Firebase UID. That upsert is atomic and race-free, and gives me a self-healing sync from Firebase's claims to my DB's denormalized copy."
