# IndexFast — Complete Codebase Reference

## 📋 Overview

**IndexFast** is an automated SEO indexing SaaS platform that helps website owners push URLs to search engines (Google, Bing, IndexNow, and ping services) faster than waiting for organic crawling. It reduces indexing time from weeks to 4-24 hours.

### Target Audience
- Bloggers & Content Creators
- Vibe Coders & Indie Hackers
- E-commerce Store Owners (Shopify/Ghost/Woo)
- Programmatic SEO (pSEO) Builders
- Niche Site Flippers
- SEO Agencies
- Local Business Owners

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** (App Router) with React 19
- **TypeScript 5** (ES2017 target, strict mode, `@/*` path alias)
- Deployed on **Vercel** with cron scheduling

### Styling & UI
- **Tailwind CSS v4** with `@tailwindcss/postcss`
- **shadcn/ui** (style: "base-mira") using Radix UI primitives
- Custom OKLCH color palette with light/dark mode
- **Framer Motion** for landing page animations
- **MUI-inspired design** (Apple-level polish per DESIGN.md)
- **Lucide React** + **HugeIcons** for icons
- **Recharts** for data visualization

### Authentication
- **Stack Auth** (`@stackframe/stack`)
- Google OAuth for GSC integration

### Database
- **PostgreSQL** (port 6543 transaction pooler)
- **Drizzle ORM** (v0.45.2) - type-safe queries

### External APIs
- **Bing Webmaster API** (SubmitUrlBatch, 500 URLs/batch)
- **IndexNow Protocol** (Bing/Yandex aggregation)
- **Google Search Console API** (googleapis SDK)
- **Ping-o-Matic** (XML-RPC) + **Pingler** (REST)
- **NVIDIA API** (qwen/qwen3-coder-480b for AI chatbot)

### Payments
- **Dodo Payments** SDK with environment-aware checkout

### Utilities
- **Cheerio** for sitemap XML parsing
- **Zod v4** for validation
- **date-fns** for date formatting
- **nanoid** for unique IDs
- **sonner** for toast notifications

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root: StackProvider, ThemeRegistry, PWA, JSON-LD
│   ├── globals.css                   # Tailwind v4, OKLCH CSS vars, themes
│   ├── (landing)/                    # Public marketing pages
│   │   ├── layout.tsx                # Navbar + Footer wrapper
│   │   ├── page.tsx                  # Landing: Hero, SocialProof, Testimonials, Features, Pricing, FAQ, CTA
│   │   ├── pricing/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── tools/                    # SEO tool pages
│   │   └── sign-in/, sign-up/, docs/, contact/, status/, terms/, privacy/
│   ├── (dashboard)/                  # Protected routes (auth required)
│   │   ├── layout.tsx                # Auth guard, DashboardShell
│   │   ├── dashboard/page.tsx        # Overview stats
│   │   ├── sites/page.tsx            # Websites management
│   │   ├── sites/[id]/archive|audit/ # Per-site views
│   │   ├── sites/url/                # URL inventory manager
│   │   ├── sites/jobs/               # Cron job manager
│   │   ├── submissions/page.tsx      # Submission history
│   │   ├── toolbox/page.tsx          # Toolbox (ping, SubmitExpress)
│   │   ├── toolbox/ping/             # Universal ping tool
│   │   ├── toolbox/submitexpress/    # Bulk submitter
│   │   ├── toolbox/pagespeed/        # PageSpeed tool
│   │   ├── settings/page.tsx         # Account + billing settings
│   │   ├── actions.ts                # All Server Actions
│   │   └── action-state.ts           # ActionState type
│   ├── (tools)/
│   │   ├── layout.tsx                # Navbar + Footer
│   │   ├── tools/page.tsx            # Tools directory homepage
│   │   ├── tools/[slug]/page.tsx     # Individual tool pages
│   │   └── tools/ext/[id]/page.tsx   # External tool shell
│   └── api/
│       ├── cron/process-submissions/ # Vercel cron handler
│       ├── billing/checkout/         # Dodo checkout
│       ├── billing/portal/           # Dodo portal
│       ├── webhook/dodo-payments/    # Dodo webhook handler
│       ├── chat/                     # NVIDIA AI chat
│       └── gsc/import/               # GSC import
├── components/
│   ├── landing/                      # Hero, Navbar, Footer, Pricing, FAQ, Features
│   ├── dashboard/                    # Shell, Sidebar, SiteCard, Stats, Settings forms
│   ├── ui/                           # 50+ shadcn primitives
│   ├── tools/                        # Tool-specific components
│   ├── ThemeRegistry.tsx             # Color mode context
│   └── pwa/PwaRegister.tsx           # PWA registration
├── lib/
│   ├── db/
│   │   ├── index.ts                  # Drizzle + postgres client
│   │   ├── schema.ts                 # Table definitions
│   │   └── user-sync.ts              # ensureUserRecord upsert
│   ├── api/
│   │   ├── bing.ts                   # Bing SubmitUrlBatch
│   │   ├── indexnow.ts               # IndexNow protocol
│   │   ├── google.ts                 # GSC API wrapper
│   │   └── ping-services.ts          # Ping-o-Matic + Pingler
│   ├── services/
│   │   ├── indexing-service.ts       # Sitemap diff + submission orchestration
│   │   ├── cron-job-runner.ts        # Cron execution with claim locking
│   │   ├── dodo-webhook-service.ts
│   │   ├── gsc-service.ts            # GSC site import
│   │   ├── subscription-service.ts
│   │   └── audit-service.ts
│   ├── billing/plans.ts              # Plan definitions
│   ├── payments/dodo.ts              # Dodo client factory
│   ├── utils/
│   │   ├── sitemap-parser.ts         # Cheerio XML parser
│   │   └── hash.ts                   # URL hashing
│   ├── tools-catalog.ts              # 80+ SEO tools catalog
│   ├── landing-faq.ts                # FAQ data
│   ├── blog-catalog.ts               # Blog metadata
│   └── utils.ts                      # cn(), URL helpers, UTM builder
├── hooks/
│   └── use-mobile.ts                 # Responsive breakpoint hook
├── stack.ts                          # Stack Auth server app
└── stack/client.ts                   # Stack Auth client
```

---

## 🗄️ Database Schema

### Tables (8 total)

1. **users** - User accounts
   - Stack Auth ID (PK), email, isPro flag
   - Dodo subscription fields (subscription_id, status, plan_id)

2. **subscription_plans** - Plan definitions
   - Plan codes (free/pro/agency), limits, features (JSONB)

3. **user_subscriptions** - Subscription state
   - Per-user subscription with lifecycle status

4. **websites** - User-owned sites
   - Sitemap URL, IndexNow key, Bing API key
   - GSC flag, siteHealth (JSONB)

5. **url_inventory** - Tracked URLs
   - Per website with hash, AI view text, discoverability score

6. **submissions** - Submission log
   - Every submission attempt (engine, status, error, timestamp)

7. **cron_jobs** - Scheduled jobs
   - Frequency (hourly/daily/weekly/monthly), engine, source_mode, nextRunAt

8. **usage_events** - Telemetry
   - Usage tracking and analytics

### Postgres Enums

- `submissionEngineEnum`: bing | indexnow | google | pingomatic | pingler
- `submissionStatusEnum`: success | failed | pending
- `subscriptionPlanEnum`: free | pro | agency
- `subscriptionLifecycleStatusEnum`: various lifecycle states
- `subscriptionIntervalEnum`: billing intervals

---

## 🚀 Core Features

### 1. Automated Sitemap Pinger
- Parses XML sitemaps via Cheerio, extracts `<loc>` URLs
- Diffs against `urlInventory` table to find new URLs
- Submits to IndexNow, Bing Batch API, and Universal Pings (Pro only)
- Manual sync via Server Action
- Automated via Vercel cron (hourly schedule: `0 * * * *`)

### 2. Multi-Engine Submission Engine
- **IndexNow:** `api.indexnow.org` with host/key/urlList payload
- **Bing Batch:** 500 URLs per batch via `ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch`
- **Google:** Sitemap ping via `google.com/ping?sitemap=`
- **Universal Pings:** Ping-o-Matic (XML-RPC) + Pingler (REST, API key required)

### 3. Cron Job System
- `cron_jobs` table with frequency, engine, and source_mode
- `processDueCronJobs()` with claim locking to prevent duplicate runs
- Vercel cron: `api/cron/process-submissions` endpoint
- Authenticated with `CRON_SECRET` bearer token

### 4. Google Search Console Integration
- OAuth via Stack Auth connected accounts
- One-click import of verified GSC sites
- Sitemap discovery and metadata refresh

### 5. SEO Tools Directory
- **35+ native tools** for technical SEO audits (Indexability, Robots.txt, Sitemap health).
- **80+ curated external tools** with tier tracking (Free, Freemium, Limited Free).
- Categorized into Indexing, Keywords, Backlinks, Authority, and Metadata.
- Integrated recommendation engine suggests professional alternatives for native checks.
- Tools explorer with search, category filtering, and sorting.

### 6. AI Chatbot & Assistant
- Streaming chat via NVIDIA API (`qwen/qwen-2.5-coder-32b`)
- Context-aware assistance for on-page and technical SEO.
- Integrated into the dashboard for rapid access.
- System prompt configured for IndexFast SEO context.

### 7. Dodo Payments Integration
- Checkout API: `/api/billing/checkout`
- Webhook handler: `/api/webhook/dodo-payments`
- Billing portal redirect for existing customers
- Environment-aware (test_mode/live_mode)

---

## 💰 Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free (Solo)** | $0/mo | 1 Site, Manual Sync, Basic Analytics |
| **Pro** | $49/mo | Unlimited Sites, Auto-Sitemap Sync (Cron), Email Alerts, Full Directory Access |
| **Agency** | $149/mo | White-Label Reports, Team Access, Higher API Quotas |

---

## 🔐 Environment Variables

### Required
```bash
DATABASE_URL=                    # Postgres connection string
NEXT_PUBLIC_SITE_URL=            # Site base URL (default: https://www.indexfast.co)
CRON_SECRET=                     # Bearer token for cron auth
NVIDIA_API_KEY=                  # AI chatbot
GOOGLE_CLIENT_ID=                # GSC OAuth
GOOGLE_CLIENT_SECRET=            # GSC OAuth
GOOGLE_REDIRECT_URI=             # GSC OAuth redirect
DODO_PAYMENTS_API_KEY=           # Dodo payments SDK
DODO_PAYMENTS_ENVIRONMENT=       # test or live
DODO_PRODUCT_ID_PRO=             # Pro plan product ID
DODO_PRODUCT_ID_AGENCY=          # Agency plan product ID
DODO_PAYMENTS_RETURN_URL=        # Checkout redirect URL
```

### Optional/Verification
```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
NEXT_PUBLIC_YANDEX_SITE_VERIFICATION=
DODO_WEBHOOK_SECRET_TEST=
DODO_WEBHOOK_SECRET_LIVE=
DODO_PAYMENTS_API_KEY_TEST=
DODO_PAYMENTS_API_KEY_LIVE=
PINGLER_API_KEY=                 # For universal pings
```

---

## 🎨 Architecture Patterns

### Route Groups (Next.js App Router)
- `(landing)` - Public marketing pages
- `(dashboard)` - Protected routes (requires Stack Auth)
- `(tools)` - Free SEO tools directory

### Data Loading Pattern
Server Components with inline async data loaders:
```tsx
export default function SitesPage() {
  return <SitesDataLoader />;
}

async function SitesDataLoader() {
  const user = await stackServerApp.getUser();
  // ... db queries
  return <SitesView initialSites={sites} />;
}
```

### Mutation Pattern
All mutations use **Server Actions** (`"use server"`) in `src/app/(dashboard)/actions.ts`:
1. Authenticate user
2. Validate input
3. Perform database operation
4. Call `revalidatePath()`
5. Return `ActionState`

### User Sync Pattern
`ensureUserRecord()` performs upsert of Stack Auth users into local Postgres `users` table on every authenticated request.

### Plan Resolution
`resolvePlanId(subscriptionStatus, isPro)` maps to `"free" | "pro" | "agency"` based on DB fields.

---

## 📈 SEO & Metadata

### Structured Data (JSON-LD)
- Organization
- WebSite
- SoftwareApplication
- FAQPage
- BreadcrumbList
- SiteNavigationElement

### Metadata Features
- OpenGraph and Twitter card images configured
- Verification meta tags for Google, Bing/Yahoo, Yandex
- Title template: `%s | IndexFast`
- Canonical URLs exported on all pages

---

## ⚙️ Configuration Files

### next.config.ts
- Ignores TypeScript build errors
- Disables worker threads
- Limits to 1 CPU (Vercel serverless optimization)
- Transpiles `@stackframe/stack` and `rrweb`

### vercel.json
- Cron schedule: `0 * * * *` (every hour)
- Cron endpoint: `/api/cron/process-submissions`

### tsconfig.json
- Path alias: `@/*` maps to `./src/*`
- Strict TypeScript with ES2017 target

---

## 🔧 API Endpoints

### Internal Server Actions
Located in `src/app/(dashboard)/actions.ts`:
- Add/edit/delete websites
- Sync sitemaps
- Import GSC sites
- Billing operations

### Public API Routes
- `POST /api/cron/process-submissions` - Cron job processor
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Billing portal redirect
- `POST /api/webhook/dodo-payments` - Dodo webhook handler
- `POST /api/chat` - AI chatbot (NVIDIA)
- `POST /api/gsc/import` - GSC site import

---

## 🎯 Key Implementation Details

1. **No `"use client"` in page.tsx files** - Pages are Server Components for SEO metadata export
2. **Radial gradient backgrounds** in dashboard shell for subtle depth
3. **Optimistic revalidation** via `revalidatePath()` after mutations
4. **Plan enforcement** at action level (website limits, submission limits)
5. **Job claiming** in cron runner using temporary `nextRunAt` update to prevent duplicate execution
6. **URL normalization** helper auto-prefixes `https://` if missing
7. **PWA support** via service worker registration in `components/pwa/PwaRegister.tsx`

---

## 📝 Development Rules

- Use `pnpm` exclusively
- All database schemas in `src/db/schema/`
- Use TypeScript `interface` over `type` for models
- Components: PascalCase naming
- File names: kebab-case (e.g., `user-profile.tsx`)
- Server Actions for all mutations
- Colocate route-specific components in `_components/` folders
- Use `loading.tsx` and `<Suspense>` for streaming

---

## 🗓️ Roadmap

- [ ] Build Core Sitemap Parser (v0.1) ✅
- [ ] Integrate Google Search Console OAuth (v0.2) ✅
- [ ] Launch "Submission Stream" Dashboard (v0.3)
- [ ] Automated Slack/Discord Notifications (v0.4)
- [ ] Redis integration (rate limiting, caching, distributed locks) - planned in docs/redis.md

---

## 📚 External Resources

- **80+ Ping Endpoints** documented in `pings.txt` and `todo.md`
- **Redis Rollout Plan** in `docs/redis.md`
- **Design Guidelines** in `DESIGN.md` (Apple-inspired)
- **Project Rules** in `docs/rules.md`

---

## 🌐 URLs

- **Production:** https://www.indexfast.co
- **Repository:** /Users/shaswatraj/Desktop/indexfast

---

*Last updated: April 23, 2026*
