# ADR-0005: Use shadcn/ui + Tailwind v4 for the component layer

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

I need a component system for the frontend — buttons, dialogs, forms, selects, etc. — that (a) looks decent out of the box, (b) is customizable without fighting the library, and (c) doesn't lock me into a design system I can't evolve.

## Decision

- **Tailwind CSS v4** as the styling engine.
- **shadcn/ui** as the component "library" — meaning components are generated into `apps/web/src/components/ui` and become part of *my* codebase, not an npm dependency.
- **Base UI** (`@base-ui/react`) as the underlying primitive layer for accessible behavior (dialogs, popovers, etc.), which shadcn's `base-nova` style wraps.
- **lucide-react** for icons.

## Alternatives considered

- **MUI / Chakra / Mantine** — mature, well-tested component libraries. Trade-off: opinionated visual language, harder to customize deeply, everything is a runtime dependency that ships to the browser. Fine choices; not what I want here.
- **Headless UI + hand-written Tailwind components** — similar spirit to shadcn but more DIY. shadcn's CLI-generated files give me the same ownership with a running start.
- **Plain CSS / CSS modules** — I want to internalize utility-first CSS as a paradigm; Tailwind is the vocabulary the industry uses.

## Consequences

- **Good:** Components are code I own. When I need a variant, I edit the file — no theme-provider gymnastics, no "eject" moment.
- **Good:** Tailwind's constraints (spacing scale, color palette) push me toward consistency without me thinking about it.
- **Good:** Accessibility is handled by Base UI primitives, not something I have to hand-roll.
- **Cost:** More files in the repo. `components/ui/` grows as I install new components.
- **Cost:** Upgrading shadcn components means re-running the CLI and reconciling my customizations. Manageable if I keep customizations localized.
- **Cost:** No enforced design system across the app — nothing stops me from typing `bg-red-500` in one place and `bg-red-600` in another. Discipline (or extracting a tokens layer later) is on me.

## Related

- Code: `apps/web/components.json`, `apps/web/src/components/ui/`
