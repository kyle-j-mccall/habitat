# Habitat Docs

This folder is where Habitat's *thinking* lives — the decisions, reasoning, and learning that don't fit in the code itself.

Habitat is a learning-and-portfolio project. The goal is not just to ship features; it's to build a body of work I can point to and talk about in interviews. That means: when I make a non-trivial decision, I write it down. When I learn something that surprised me, I write it down.

## Layout

```
docs/
  adr/        Architecture Decision Records — one file per "why did you build it this way?"
  learning/   Dated journal entries — what I hit, what confused me, what clicked
```

More folders (`design/` for pre-feature specs, `runbook/` for ops notes) get added the first time I have something real to put in them. No empty scaffolding.

## The rules I try to follow

- **Write the ADR before or with the change**, not after. It's the reasoning that's valuable, not the retrospective narration.
- **Keep it short.** If it takes more than one page, either the decision is too big (split it) or I'm overexplaining.
- **Update, don't delete.** If a decision changes, add a new ADR that supersedes the old one and mark the old one accordingly. History matters — future-me needs to see the shift.
- **Learning entries are for me.** They can be messy. They exist to help me review before an interview.
