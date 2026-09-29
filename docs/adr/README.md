# Architecture Decision Records

An **ADR** captures a single architectural decision: what I chose, why, and what I gave up by choosing it. The format is deliberately small so writing one doesn't feel like a chore.

## When to write one

- I'm about to pick between two or more real alternatives (framework, pattern, boundary).
- The choice will be hard to reverse later, or hard for a future reader to reconstruct.
- Someone asking "why is it this way?" would deserve a real answer.

If a decision is trivially reversible and self-explanatory, skip the ADR.

## Filename

`NNNN-kebab-case-title.md` — zero-padded, monotonically increasing. E.g. `0007-add-redis-for-rate-limiting.md`.

Numbers never get reused, even for superseded ADRs.

## Status values

- **Proposed** — draft, still open to change.
- **Accepted** — in force. Reflects the current codebase.
- **Superseded by NNNN** — replaced by a newer ADR. Leave the file in place; it's history.
- **Deprecated** — no longer relevant, but not replaced by anything specific.

---

## Template

Copy the block below into a new file when starting an ADR.

```markdown
# ADR-NNNN: <short imperative title>

- **Status:** Proposed
- **Date:** YYYY-MM-DD

## Context

What situation triggered this decision? What forces are at play — constraints,
goals, prior decisions this builds on? Keep it to what's needed to understand
the choice; this isn't a history lesson.

## Decision

What am I actually doing? State it as a clear, declarative sentence or two.
"We will use X for Y."

## Alternatives considered

- **Option A** — why it was tempting, why I didn't pick it.
- **Option B** — same.

Even 2–3 lines each is fine. The point is to prove I looked at the space, not
to write a thesis.

## Consequences

What does choosing this cost me? What becomes easier? What becomes harder?
Include the awkward parts — every real decision has some. If there's an obvious
thing this decision *doesn't* solve, name it.

## Related

Links to other ADRs, PRs, external docs, or code paths. Optional.
```
