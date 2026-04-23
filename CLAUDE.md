# Claude Guidelines for IndexFast

Follow the comprehensive instructions in **[AGENTS.md](/AGENTS.md)**.

## Core Commands
- **Dev**: `bun dev` or `pnpm dev`
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Database**: `bunx drizzle-kit studio` (view data) or `bunx drizzle-kit generate` (migrations)

## Key Files
- `INDEXFAST.md`: Architecture overview.
- `src/lib/db/schema.ts`: Database schema.
- `src/app/(dashboard)/actions.ts`: Server Actions.
- `src/lib/tools-catalog.ts`: SEO tools data.
