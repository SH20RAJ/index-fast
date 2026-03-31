# IndexFast — Lean & Fast SEO Indexing SaaS

Automated search engine indexing for bloggers, vibe coders, and SEO enthusiasts. No AI bloat, just speed and results.

## 🎯 Target Audience
- **Vibe Coders:** Developers who want to launch fast and see immediate indexing results without reading 50 pages of documentation.
- **Bloggers & Content Creators:** People who ship daily and need their new posts on Google/Bing within minutes, not weeks.
- **E-commerce Store Owners:** (Shopify/Ghost/Woo) Need new product pages indexed instantly to start capturing seasonal or trending traffic.
- **Programmatic SEO (pSEO) Builders:** Managing 10,000+ pages that need systematic crawling and indexing coordination to avoid "Discovered - currently not indexed" limbo.
- **Niche Site Flippers:** Scaling sites quickly to improve traffic metrics for a faster, higher-value exit.
- **Indie Hackers:** Builders who need early search traction to validate their ideas and get their first 100 users.
- **Local Business Owners:** Ensuring their specific service pages (e.g., "Plumber in Austin") are live the moment they launch to capture local leads.
- **SEO Agencies:** Teams managing multiple client sites who need a unified, high-level "pushed-to-index" dashboard to show progress to clients.

---

## 🛠️ Core Features (MVP)

### 1. Automated Sitemap Pinger
- **How it works:** Add a sitemap URL once.
- **Sync:** Runs every 6 hours (Cron).
- **Action:** Automatically detects new URLs and pushes them to IndexNow and Bing Batch API.

### 2. Instant Bing & IndexNow Submission
- **Bing API:** Uses `SubmitUrlbatch` for high-volume URL pushes.
- **IndexNow:** Real-time notification to Bing, Yandex, and other participating engines.
- **Key Verification:** Simple automated check to ensure your `indexnow.txt` is correctly placed.

### 3. GSC One-Click Importer
- **Connect:** Securely list all your verified sites from Google Search Console.
- **Sync:** Import sites and their metadata in one click to start tracking.

### 4. SEO Toolbox
- **Directory Launcher:** A curated list of 100+ high-DA manual submission sites (Reddit, IndieHackers, ProductHunt, etc.).
- **Header Status Checker:** Verify if your pages are returning clean `200 OK` responses.
- **Dead Link Guard:** Flags 404 links in your sitemap before they hurt your indexing quota.

---

## 💻 Tech Stack

- **Core:** Next.js (App Router)
- **Styling:** Tailwind CSS (Modern, premium aesthetics)
- **Database:** PostgreSQL (Optimal storage for URLs and submission history)
- **Runtime:** Cloudflare Workers (Scaling API submissions)
- **Automation:** Scheduled Cron Jobs (Syncing sitemaps on autopilot)

---

## 🔌 API Reference (Fast Implementation)

### IndexNow (POST)
- **Endpoint:** `https://www.bing.com/indexnow`
- **Body:**
  ```json
  {
    "host": "example.com",
    "key": "your-key-string",
    "urlList": ["https://example.com/page1", "https://example.com/page2"]
  }
  ```

### Bing Batch Submission (POST)
- **Endpoint:** `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=YOUR_API_KEY`
- **Body:**
  ```json
  {
    "siteUrl": "https://example.com",
    "urlList": ["https://example.com/page1", "https://example.com/page2"]
  }
  ```

---

## 💸 Monetization Strategy

| Plan | Features |
| :--- | :--- |
| **Free (Solo)** | 1 Site, Manual "One-Click" Sync, Basic Analytics. |
| **Premium ($)** | Unlimited Sites, **Auto-Sitemap Sync (Cron)**, Email Alerts, Full Directory Access. |
| **Agency ($$)** | White-Label Reports for clients, Team Access, Higher API Quotas. |

---

## 🗓️ Roadmap
- [ ] Build Core Sitemap Parser (v0.1)
- [ ] Integrate Google Search Console OAuth (v0.2)
- [ ] Launch "Submission Stream" Dashboard (v0.3)
- [ ] Automated Slack/Discord Notifications (v0.4)
