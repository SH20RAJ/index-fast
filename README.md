# IndexFast — Lean & Fast SEO Indexing SaaS

Automated search engine indexing for bloggers, vibe coders, and SEO enthusiasts. No AI bloat, just speed, results, and maximum AI visibility.

## 🎯 Target Audience
- **Vibe Coders:** Developers who want to launch fast and see immediate indexing results.
- **Bloggers & Content Creators:** People who ship daily and need their new posts on Google/Bing within minutes.
- **E-commerce Store Owners:** Need new product pages indexed instantly to start capturing seasonal or trending traffic.
- **Programmatic SEO (pSEO) Builders:** Managing 10,000+ pages that need systematic crawling and indexing coordination.
- **AI-Focused Brands:** Ensuring content is indexed in Bing to appear in ChatGPT, Copilot, and Perplexity answers.

## 🛠️ Core Features

### 1. Automated Sitemap Pinger
- **How it works:** Add a sitemap URL once.
- **Sync:** Runs every hour via Vercel Cron.
- **Action:** Automatically detects new URLs and pushes them to IndexNow, Bing Batch API, and Universal Ping services.

### 2. Instant Bing & IndexNow Submission
- **Bing API:** Uses `SubmitUrlbatch` for high-volume URL submission.
- **IndexNow:** Real-time notification to Bing, Yandex, and other participating engines.
- **Key Verification:** Simple automated check to ensure your `indexnow.txt` is correctly placed.

### 3. SEO Tools Directory (100+ Tools)
- **Built-in Utilities:** 35+ native tools for indexability checks, sitemap audits, robots.txt testing, and more.
- **Curated Alternatives:** 80+ curated external tools with tier badges (free/freemium/limited-free) for professional-grade SEO workflows.
- **Categories:** Indexing/Crawl, Keyword Research, Backlink Analysis, Domain Authority, Metadata & Snippets.

### 4. AI & GEO (Generative Engine Optimization)
- **AI View:** See exactly what LLMs (ChatGPT, Claude) read from your pages.
- **Discoverability Score:** Track how likely your content is to be cited by AI assistants.
- **AI Chatbot:** Built-in SEO assistant powered by NVIDIA's Qwen models to help you optimize content in real-time.

### 5. MCP Support (Model Context Protocol)
- **AI-First:** Connect IndexFast to your AI agents (Claude Desktop, Cursor, Windsurf).
- **Tooling:** Submit URLs, run SEO audits, and check usage directly from your chat interface or IDE.

## 💻 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, React 19)
- **Authentication:** [Stack Auth](https://stack-auth.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Drizzle ORM)
- **Payments:** [Dodo Payments](https://dodopayments.com/)
- **AI Backend:** [NVIDIA API](https://build.nvidia.com/) (Qwen/Qwen2.5-Coder-32B)
- **Automation:** Vercel Cron Jobs

## 🚀 Local Development

Install and run:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Required Environment Variables

```bash
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
CRON_SECRET=
NVIDIA_API_KEY=
DODO_PAYMENTS_API_KEY=
DODO_PRODUCT_ID_PRO=
DODO_PRODUCT_ID_AGENCY=
```

## 📜 Principles
- Keep it simple & fast.
- Focus on practical SEO & AI visibility.
- Build for revenue from day one.
- Mobile-first, accessible, and high-polish design.
