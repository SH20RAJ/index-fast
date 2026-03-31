# IndexFast — Lean & Fast SEO Indexing SaaS

Automated search engine indexing for bloggers, vibe coders, and SEO enthusiasts. No AI bloat, just speed, results, and maximum AI visibility.

## 🎯 Target Audience
- **Vibe Coders:** Developers who want to launch fast and see immediate indexing results.
- **Bloggers & Content Creators:** People who ship daily and need their new posts on Google/Bing within minutes.
- **E-commerce Store Owners:** Need new product pages indexed instantly to start capturing seasonal or trending traffic.
- **Programmatic SEO (pSEO) Builders:** Managing 10,000+ pages that need systematic crawling and indexing coordination.
- **AI-Focused Brands:** Ensuring content is indexed in Bing to appear in ChatGPT, Copilot, and Perplexity answers.

## 🛠️ Core Features (MVP)

### 1. Automated Sitemap Pinger
- **How it works:** Add a sitemap URL once (Example: `https://30tools.com/sitemap.xml`).
- **Sync:** Runs every 6 hours for Pro users.
- **Action:** Automatically detects new URLs and pushes them to IndexNow, Bing Batch API, and Universal Ping services.

### 2. Instant Bing & IndexNow Submission
- **Bing API:** Uses `SubmitUrlbatch` with your dedicated API key.
- **IndexNow:** Real-time notification to Bing, Yandex, and other participating engines.
- **Key Verification:** Simple automated check to ensure your `indexnow.txt` is correctly placed.

### 3. Universal Ping Integration
- **Ping-o-Matic & Pingler:** Automatically notify a wide network of search engines and aggregators whenever new content is published.

### 4. AI Visibility Tools
- **AI View:** See exactly what LLMs (ChatGPT, Claude) read from your pages by stripping away design bloat.
- **Discoverability Score:** Track how likely your content is to be cited by AI assistants.

### 5. GSC One-Click Importer
- **Connect:** Securely list all your verified sites from Google Search Console via Stack Auth.
- **Sync:** Import sites and their metadata in one click to start tracking.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Authentication:** [Stack Auth](https://stack-auth.com/)
- **Styling:** [Material UI (MUI)](https://mui.com/) + [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via Drizzle ORM)
- **Payments:** [Dodo Payments](https://dodopayments.com/)
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/) (Scaling API submissions)
- **Automation:** Scheduled Cron Jobs (Syncing sitemaps on autopilot)

## 💸 Monetization Strategy

| Plan | Features |
| :--- | :--- |
| **Free (Starter)** | 1 Site, up to 50 URLs / month, Manual "One-Click" Sync. |
| **Pro ($49)** | Unlimited Sites, **Auto-Sitemap Sync (6h)**, AI View, Universal Pings. |
| **Agency ($149)** | White-labeled Reports, API Access, Account Manager. |

## 🗓️ Roadmap
- [x] Build Core Marketing Landing Pages
- [x] Integrate Stack Auth
- [x] Scaffolding for Sitemap Parser & API Utilities
- [ ] Launch "Submission Stream" Dashboard with AI Insights (v0.1)
- [ ] Implement Automated Sitemap Cron + Ping Services (v0.2)
- [x] Dodo Payments Integration (checkout, portal, webhook sync)
- [ ] Automated Slack/Discord Notifications (v0.4)

## 🚀 Local Development

Install and run:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Required Payment Environment Variables

```bash
# Common
DODO_PAYMENTS_ENVIRONMENT=test_mode # or live_mode
DODO_PAYMENTS_RETURN_URL=/dashboard

# API keys (either set DODO_PAYMENTS_API_KEY directly, or use env-specific keys)
DODO_PAYMENTS_API_KEY_TEST=...
DODO_PAYMENTS_API_KEY_LIVE=...

# Webhook secrets (either set DODO_WEBHOOK_SECRET directly, or use env-specific keys)
DODO_WEBHOOK_SECRET_TEST=...
DODO_WEBHOOK_SECRET_LIVE=...

# Product IDs used for checkout session creation
DODO_PRODUCT_ID_PRO=...
DODO_PRODUCT_ID_AGENCY=...
```

Webhook endpoint:

`POST /api/webhook/dodo-payments`

## 📜 Principles
- Keep it simple & fast
- Focus on practical SEO & AI visibility
- Build for revenue from day one
