# Habitat

Habitat is the foundation for a smart reptile husbandry and enclosure-monitoring platform.

## Prerequisites

- Node.js 22 or newer
- pnpm 10
- Docker with Docker Compose

## Setup

```sh
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm db:up
pnpm db:generate
pnpm dev
```

The checked-in example files contain development-safe local defaults. Environment files are ignored by Git.

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Health endpoint: http://localhost:3000/health

## Commands

```sh
pnpm dev          # Run the frontend and API together
pnpm lint         # Lint the workspace
pnpm typecheck    # Type-check every package
pnpm db:up        # Start PostgreSQL
pnpm db:down      # Stop PostgreSQL
pnpm db:generate  # Generate the Prisma client
pnpm db:migrate   # Create/apply a development migration when models exist
```

## Repository structure

```text
apps/web/        React, Vite, Router, and TanStack Query frontend
apps/api/        Express API and Prisma configuration
packages/shared/ Shared runtime schemas and TypeScript types
docker-compose.yml  Local PostgreSQL service
```
