# ⚡ IndexFast — Instant SEO Indexing for AI-Era Websites

IndexFast is a high-performance SEO indexing engine designed for the AI-first web. It automates the process of notifying Google, Bing, and IndexNow about your new content, ensuring your pages are indexed within minutes instead of weeks.

---

## 🎯 The IndexFast Mission
In the era of AI search (ChatGPT, Perplexity, Copilot), visibility starts with indexing. IndexFast removes the friction between "Published" and "Indexed," giving your content the priority it deserves.

- **Vibe Coders:** Launch fast, index faster.
- **Bloggers:** Your content on Bing/Google before the "New Post" notification even hits.
- **pSEO Builders:** Manage indexing for 100k+ pages with zero manual effort.
- **AI-Focused Brands:** Maximize discoverability in Generative Search Engines.

---

## ✨ Key Features

### 🚀 **Automation Manager (Auto-Run)**
Set it and forget it. IndexFast scans your sitemaps and feeds every 24 hours, automatically submitting new URLs to Bing and IndexNow.
- **Intelligent Diffing:** Only submits truly new or updated content.
- **Conflict Resolution:** Handles rate limits and engine-specific constraints.

### 🛠️ **The SEO Toolbox**
A curated directory of 120+ SEO utilities, including:
- **Indexability Checks:** Real-time validation of robots.txt and meta tags.
- **Sitemap Audits:** Deep scan of your sitemap structure and link health.
- **GEO Optimizer:** Analyze how AI agents perceive and cite your content.

### 🤖 **AI Agents & MCP**
IndexFast speaks the language of AI. With built-in **Model Context Protocol (MCP)** support, you can control your indexing workflow directly from AI IDEs like **Cursor**, **Windsurf**, or **Claude Desktop**.
- *"Rank all new URLs to search engines using IndexNow"*
- *"Run a technical SEO audit on my latest site"*

### 📱 **High-Polish Dashboard**
A minimalist, high-contrast dashboard built with **Tailwind CSS v4** and **OKLCH** colors.
- **Multi-Property Support:** Manage all your domains from a single interface.
- **Real-time Logs:** Track every submission and engine response with detailed diagnostics.

---

## 💻 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, React 19)
- **Auth:** [Stack Auth](https://stack-auth.com/) (Managed User Identity)
- **Database:** [PostgreSQL](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Compute:** Vercel Cron + Serverless Functions

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment
Create a `.env.local` file:
```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Authentication (Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# AI & Tools
NVIDIA_API_KEY=
CRON_SECRET=
```

### 3. Initialize Database
```bash
bunx drizzle-kit push
```

### 4. Launch Development Server
```bash
bun dev
```

---

## 📜 Architectural Principles

Detailed technical documentation can be found in:
- [**INDEXFAST.md**](./INDEXFAST.md): Database schema and directory structure.
- [**DESIGN.md**](./DESIGN.md): UI/UX principles and OKLCH color tokens.
- [**AGENTS.md**](./AGENTS.md): Guidelines for AI Agents working on this repo.

---

Built with ⚡ by **IndexFast Team**.
