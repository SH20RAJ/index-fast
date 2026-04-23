# IndexFast AI Agent Guidelines

This document provides context and rules for AI agents (like Claude, Cursor, Windsurf, or Gemini) working on the IndexFast codebase.

## 🧠 Project Context
IndexFast is a Next.js 15 (React 19) SEO Indexing SaaS. It uses a high-polish minimalist design, warm earth tones, and focused technical SEO utilities.

## 📖 Key Documentation
- **[INDEXFAST.md](/INDEXFAST.md)**: The "source of truth" for architecture, directory structure, and database schema.
- **[DESIGN.md](/DESIGN.md)**: UI/UX principles, OKLCH colors, and typography.
- **[docs/rules.md](/docs/rules.md)**: Specific coding standards and patterns.

## 🛠️ Tech Stack & Conventions
- **Framework**: Next.js App Router (Server Components by default).
- **Styling**: Tailwind CSS v4. Use OKLCH variables from `globals.css`.
- **Database**: Drizzle ORM + PostgreSQL. All schemas in `src/lib/db/schema.ts`.
- **Auth**: Stack Auth. Use `stackServerApp.getUser()` in server components.
- **Mutations**: Use Server Actions in `src/app/(dashboard)/actions.ts`.

## 🚫 Critical Rules
1. **No `use client` in `page.tsx`**: Keep pages as Server Components for SEO metadata. Wrap interactive parts in client components if needed.
2. **Path Aliases**: Always use `@/*` for imports from `src/`.
3. **Database Sync**: Use `ensureUserRecord()` from `src/lib/db/user-sync.ts` in authenticated server routes to sync Stack users with Postgres.
4. **Icons**: Use `Lucide React` for general UI and check `src/components/icons/` for custom ones.

## 🤖 How to Help
- When adding a tool, update `src/lib/tools-catalog.ts`.
- When modifying the dashboard, ensure responsive mobile design.
- Always check `ActionState` return types for Server Actions.
