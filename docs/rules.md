# Project Rules & Best Practices: IndexFast

## 📂 Folder Structure (Standardized)
All source code resides in the `src/` directory.

```text
src/
├── app/                  # Next.js App Router (Routing, Layouts, Metadata)
│   ├── (landing)/        # Public marketing & static pages
│   ├── (dashboard)/      # Protected routes for the management platform
│   │   └── _components/  # Components SPECIFIC to a route
│   ├── (tools)/          # SEO tools directory
│   ├── api/              # API Route Handlers (Cron, Webhooks, Chat)
│   ├── layout.tsx        # Root layout (Auth, Theme, PWA)
│   └── globals.css       # Tailwind v4 styles & OKLCH variables
├── components/           # Shared UI components
│   ├── ui/               # shadcn/ui primitives (Radix-based)
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard layout & shared elements
│   └── tools/            # Components for SEO tools
├── lib/                  # Core logic & Service Layer
│   ├── db/               # Drizzle ORM schema & client
│   ├── api/              # External API wrappers (Bing, Google, etc.)
│   ├── services/         # Business logic (Indexing, Audits, Billing)
│   └── utils/            # Helper functions (Sitemap parser, formatting)
├── hooks/                # Custom React hooks
└── types/                # TypeScript interfaces
```

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Database:** PostgreSQL with Drizzle ORM
- **Styling:** Tailwind CSS v4 + Framer Motion
- **UI Components:** shadcn/ui (Radix UI)
- **Auth:** Stack Auth (`@stackframe/stack`)
- **Payments:** Dodo Payments
- **AI:** NVIDIA API (Qwen models)

## 🎨 UI & Styling Rules
1. **OKLCH Colors**: Use the warm terracotta palette defined in `globals.css` using OKLCH.
2. **Minimalism**: Favor subtle borders and whitespace over heavy shadows.
3. **Icons**: Use `Lucide React` for UI and `HugeIcons` for specialized categories.
4. **Animations**: Use `Framer Motion` for layout transitions and scroll reveals.

## 🚀 Next.js & React Best Practices
1. **Server Components**: All pages in `app/` should be Server Components by default to support SEO metadata.
2. **Server Actions**: All mutations must use Server Actions (`"use server"`) located in `src/app/(dashboard)/actions.ts` or route-specific action files.
3. **Data Fetching**: Fetch data directly in Server Components. Use `<Suspense>` and `loading.tsx` for streaming.
4. **Auth Guards**: Use `stackServerApp.getUser()` to protect dashboard routes.
5. **Database Sync**: Call `ensureUserRecord()` in authenticated server contexts to keep Postgres in sync with the Auth provider.

## 📈 SEO & Metadata
1. **Metadata API**: Always export `metadata` from `page.tsx`.
2. **Canonical URLs**: Ensure every page has a canonical URL set.
3. **Structured Data**: Use JSON-LD for Organization, SoftwareApplication, and FAQ pages.
4. **Title Template**: `%s | IndexFast`

## 📜 Coding Standards
- Use `pnpm` or `bun` for package management.
- Kebab-case for file names (`sitemap-parser.ts`).
- PascalCase for React components (`SiteCard.tsx`).
- Absolute imports using `@/*` alias.
- Use `interface` over `type` for object definitions.
- Strictly typed Server Actions using `ActionState`.
