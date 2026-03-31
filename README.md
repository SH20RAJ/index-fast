# IndexFast

IndexFast is a lean SaaS for faster indexing.
No AI-heavy workflows. No complex setup. Just submit, sync, and track URLs through IndexNow, Bing, and Google Search Console related flows.

## Why This Product

Most creators and indie teams publish content faster than search engines discover it.
IndexFast helps close that gap with simple automation.

## Target Audience

- Vibe coders shipping projects fast and needing pages indexed quickly
- Bloggers and content teams publishing daily content
- SEO freelancers and small agencies managing multiple client sites
- pSEO builders handling large URL volumes
- Indie hackers validating ideas with organic traffic
- Local business sites that need service pages indexed fast

## Core MVP Features

### 1) Sitemap Auto Sync

- Add sitemap once
- Cron checks for new URLs
- New URLs are auto-submitted

### 2) IndexNow + Bing Submission

- IndexNow push for participating engines
- Bing batch submission support via:
  `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=`
- Fast retries and simple status logging

### 3) Google Search Console Import

- Connect Google account
- List verified sites
- Import sites into dashboard in one click

### 4) Lightweight SEO Tools

- Submission directory list
- Header/status checker (`200/3xx/4xx`)
- Dead-link checks from sitemap URLs

## Monetization-First Approach

- Free: limited sites + manual sync
- Pro: auto sitemap sync + more quotas + history
- Agency: multi-site workflows + team access + reporting

Build simple, solve a painful workflow, and charge for automation.

## Current Repo Status

Implemented now:

- Marketing landing pages
- Auth route scaffold
- Integration utilities in `src/lib/` for Bing, Google, IndexNow, and sitemap parsing
- UI component system and app layout

Scaffolded (next build stage):

- Dashboard pages in `src/app/(dashboard)/dashboard/` and `src/app/(dashboard)/sites/`
- Data models, usage history UI, and paid plan limits

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind + MUI
- Postgres-ready dependencies (Drizzle + postgres)
- Google APIs + HTTP utility layer
- Cron-friendly architecture for sitemap sync

Planned deployment style:

- Next.js app for dashboard + API routes
- Cloudflare Workers for high-throughput submission tasks
- Cron jobs for periodic sitemap processing

## Local Development

Install and run:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

### Environment Variables (minimum)

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...
```

Add auth/provider keys as needed for your Stack setup.

## Scripts

- `pnpm dev` start development server
- `pnpm build` production build
- `pnpm start` run production build
- `pnpm lint` run ESLint

## Roadmap

1. Finish dashboard (sites, submissions, status stream)
2. Add Postgres schema and persistence
3. Implement cron-driven sitemap diff pipeline
4. Add quotas and billing gates for paid plans
5. Launch directory and SEO utility tools inside dashboard

## Principles

- Keep it simple
- Avoid compute-heavy features
- Focus on fast shipping and revenue
- Build practical SEO workflows, not hype features
