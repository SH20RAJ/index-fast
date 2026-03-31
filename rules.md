# Project Rules & Best Practices: IndexFast

## 📂 Folder Structure (Standardized)
All source code resides in the `src/` directory.

```text
src/
├── app/                  # Next.js App Router (Routing, Layouts, Metadata)
│   ├── (auth)/           # Logic for login/registration
│   ├── (dashboard)/      # Protected routes for the management platform
│   │   └── sites/        # Site management pages
│   │       ├── _components/ # Components SPECIFIC to this route
│   │       └── page.tsx
│   ├── api/              # Public/Private API Route Handlers
│   ├── layout.tsx        # Root layout with MUI Cache/Theme Providers
│   └── globals.css       # Global styles (keep minimal)
├── components/           # Shared UI components (Atomic design)
│   ├── ui/               # Basic primitives (Buttons, Inputs)
│   ├── layout/           # Shared layouts (Navbars, Footers)
│   └── indicators/       # SEO/Index status indicators
├── db/                   # Database Layer (Drizzle ORM)
│   ├── schema/           # SQL table definitions
│   └── index.ts          # Postgres connection instance
├── lib/                  # External API wrappers (Google, Bing, IndexNow)
├── hooks/                # Custom React hooks
├── types/                # TypeScript interfaces/types
└── utils/                # Pure helper functions
```

## 🛠️ Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Database:** PostgreSQL (Cloudflare Hyperdrive or Neon)
- **ORM:** Drizzle ORM (Type-safe SQL)
- **UI & Styling:** Material UI (MUI) v6 with Emotion
- **State Management:** React Server Components (RSC) + Server Actions
- **Auth:** Next-Auth / Auth.js

## 🎨 MUI (Material UI) Implementation Rules
To ensure zero Flash of Unstyled Content (FOUC) and optimal performance:
1. **Server First:** Use Server Components for data fetching. Pass data to Client Components that use MUI.
2. **ThemeProvider:** Wrap the app in `AppRouterCacheProvider` inside `src/app/layout.tsx`.
3. **Registry:** Use a `ThemeRegistry` Client Component for your `ThemeProvider` and `CssBaseline`.
4. **Icons:** Use `@mui/icons-material` but favor SVGs for super-lightweight components.

## 🚀 Next.js Best Practices
1. **Server Actions:** All mutations (deleting a site, adding a sitemap) MUST happen in Server Actions.
2. **Colocation:** Keep components used by only one page inside a `_components` folder next to that `page.tsx`.
3. **Streaming:** Use `loading.tsx` and `<Suspense>` for data-heavy dashboard views.
4. **Environment Variables:** All secrets (Google API, DB URLs) strictly in `.env.local`. NEVER export them to the client unless prefixed with `NEXT_PUBLIC_`.

## 📈 SEO & Metadata Rules
1. **Metadata API:** Use `export const metadata` in static pages and `generateMetadata()` for dynamic site details.
2. **Title Template:** Use `%s | IndexFast` in the root layout.
3. **Canonical Tags:** Always export canonical URLs to avoid duplicate content rankings.
4. **Sitemap:** Use `app/sitemap.ts` to generate dynamic sitemaps for the IndexFast landing pages.
5. **Standard Metadata Object:**
```typescript
export const metadata = {
  title: 'IndexFast | Automated SEO Indexing',
  description: 'Submit your URLs to Google, Bing, and IndexNow instantly.',
  metadataBase: new URL('https://indexfast.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
  },
};
```

## 📜 Coding Technical Rules
- Use `pnpm` exclusively.
- All database schemas must be in `src/db/schema/`.
- Use TypeScript `interface` over `type` for model definitions.
- Components should be functional and named using PascalCase.
- File names should use kebab-case (e.g., `user-profile.tsx`).
