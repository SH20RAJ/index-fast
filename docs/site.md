# IndexFast — The Indexing Engine for Growth

IndexFast is an automated SEO indexing SaaS platform that helps website owners push URLs to search engines (Google, Bing, IndexNow, and ping services) faster than waiting for organic crawling.

## 🎯 Target Audience
- **Vibe Coders & Indie Hackers**: Developers launching fast and needing immediate indexing.
- **Bloggers & Content Creators**: People who ship daily and need their posts on Google/Bing in minutes.
- **E-commerce Store Owners**: Capturing seasonal or trending traffic with instant indexing of new products.
- **Programmatic SEO (pSEO) Builders**: Managing 10,000+ pages with systematic crawling coordination.
- **AI-Focused Brands**: Ensuring content is indexed in Bing to appear in ChatGPT, Copilot, and Perplexity.
- **SEO Agencies**: Unified dashboard to manage and report on client site indexing.

---

## 🛠️ Core Features

### 1. Automated Sitemap Pinger
- **How it works**: Connect your sitemap URL once.
- **Sync**: Automated hourly sync via Vercel Cron for Pro users.
- **Action**: Diffs sitemap URLs against existing inventory and pushes new ones to all configured engines.

### 2. Multi-Engine Submission
- **Bing Batch API**: Push up to 500 URLs per batch for instant processing.
- **IndexNow Protocol**: Real-time notification to Bing, Yandex, and participating engines.
- **Google Search Console**: Integrated site import and metadata refresh via GSC API.
- **Universal Pings**: Automated pings to Ping-o-Matic and Pingler to notify the wider web.

### 3. SEO Tools Directory (100+ Tools)
- **Built-in Tools**: 35+ native utilities for technical SEO audits (Indexability, Robots.txt, Sitemap health).
- **Curated Directory**: 80+ professional-grade external tools with categorization and tier tracking.

### 4. AI & GEO Insights
- **AI View**: Analysis of how LLMs perceive and read your content.
- **Discoverability Score**: Metrics on how likely your content is to be cited by AI search engines.
- **AI Assistant**: Dashboard chatbot for real-time SEO advice and automation.

---

## 💻 Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + OKLCH Color System
- **Auth**: Stack Auth
- **DB**: PostgreSQL + Drizzle ORM
- **Payments**: Dodo Payments
- **AI**: NVIDIA API (Qwen Models)

---

## 💸 Pricing Plans

| Plan | Features |
| :--- | :--- |
| **Free (Solo)** | 1 Site, Manual "One-Click" Sync, Basic Tools. |
| **Pro ($49/mo)** | Unlimited Sites, **Auto-Sitemap Sync (Hourly)**, AI View, Full Tools Access. |
| **Agency ($149/mo)** | White-label Reports, API Access, Team Management. |
