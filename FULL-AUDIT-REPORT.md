# IndexFast SEO Audit Report
**Date:** 2026-05-16 | **URL:** https://indexfast.co | **Overall Score: 49/100**

---

## Executive Summary

IndexFast has strong SEO foundations (meta tags, sitemap, security headers, structured data concepts) but a **catastrophic rendering failure** makes the site effectively invisible to search engines and AI crawlers. Every page's SSR body is empty or shows a loading screen. The JSON-LD exists in code but renders client-side only.

### Top 5 Critical Issues
1. **SSR body is empty** — Homepage shows "Getting things ready…", other pages show 404
2. **JSON-LD is client-side only** — Invisible to Googlebot and AI crawlers
3. **WWW/Non-WWW mismatch** — Sitemap says `www`, server redirects to non-www
4. **1,783 KB JS payload** — Stack Auth (565 KB) loads on public pages unnecessarily
5. **5 duplicate blog posts** — Same content at two URLs each

### Top 5 Quick Wins
1. Create `/public/llms.txt` (1 hour, +10 GEO points)
2. Add `font-display: "swap"` to fonts (15 min, fixes FOIT)
3. Fix robots.txt `Host` directive to non-www (5 min)
4. Remove `/sign-in`, `/sign-up`, `/chat` from sitemap (10 min)
5. Add `OAI-SearchBot` and `CCBot` to robots.txt (5 min)

---

## Scoring Breakdown

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Technical SEO | 22% | 28/100 | SSR broken, www mismatch |
| Content Quality | 23% | 61/100 | Good copy, fake testimonials |
| On-Page SEO | 20% | 65/100 | Meta tags good, SSR empty |
| Schema / Structured Data | 10% | 45/100 | Exists but client-side |
| Performance (CWV) | 10% | 50/100 | TTFB 651ms, 477KB Brotli JS |
| AI Search Readiness | 10% | 38/100 | No llms.txt, JS-rendered |
| Images | 5% | 60/100 | N/A (mostly text site) |
| **TOTAL** | **100%** | **49/100** | |

---

## CRITICAL Issues (Fix Immediately)

### C1: SSR Body is Empty
**Impact: BLOCKS INDEXING**
- Homepage SSR body: 31 chars ("IndexFast Getting things ready…")
- All other pages (/blog, /pricing, /tools, etc.): Show Next.js default 404
- Every landing component uses `"use client"` — Hero, Features, FAQ, Pricing, HowItWorks
- Stack Auth `useUser()` hook in Hero blocks SSR prerendering
- **Fix:** Extract static content into Server Components. Only CTA button (auth-dependent) stays client.

### C2: JSON-LD is Client-Side Only
**Impact: INVISIBLE TO CRAWLERS**
- 3 JSON-LD blocks exist in code (Organization, WebSite, FAQPage, SoftwareApplication, BlogPosting)
- Root layout uses `<Script strategy="beforeInteractive">` instead of plain `<script type="application/ld+json">`
- Landing page JSON-LD at bottom of JSX — omitted if any child fails SSR
- **Fix:** Replace `<Script>` with `<script>`, move to top of return statement

### C3: WWW/Non-WWW Mismatch
**Impact: EVERY URL REDIRECTS**
- Sitemap: all 98 URLs use `https://www.indexfast.co`
- Canonical tags: point to `https://www.indexfast.co`
- robots.txt `Host`: `https://www.indexfast.co`
- Server: 301 redirects www → `https://indexfast.co` (non-www)
- **Fix:** Pick one (non-www recommended), update sitemap.ts, canonicals, robots.txt

### C4: JavaScript Payload is 1,783 KB
**Impact: FAILS INP ON MOBILE**
| Library | Raw Size | Issue |
|---------|----------|-------|
| Stack Auth SDK | 565 KB | Loads on public landing page (zero auth needed) |
| Framer Motion | 324 KB | CSS animations can replace this |
| date-fns | ~124 KB | Not tree-shaken |
| Next.js runtime | 226 KB | Unavoidable |
- **Fix:** Lazy-load Stack Auth on dashboard only. Replace Framer Motion with CSS.

### C5: 5 Duplicate Blog Post Pairs
**Impact: THIN CONTENT / CANNIBALIZATION**
- `bing-webmaster-vs-google-search-console` ↔ `bing-webmaster-tools-vs-google-search-console-2026`
- `indexnow-vs-sitemap-submission` ↔ `indexnow-vs-sitemap-submission-2026`
- `ai-search-killing-traditional-seo` ↔ `ai-search-killing-traditional-seo-2026`
- `indexnow-secret-10000-pages-24-hours` ↔ `indexnow-secret-10k-pages-24h`
- `free-seo-tools-convert-visitors-subscribers-2026` ↔ `free-seo-tools-convert-visitors-to-subscribers`
- **Fix:** Delete duplicates from DB, 301 redirect old slugs

---

## HIGH Priority Issues

### H1: No `llms.txt`
- Returns 404. AI crawlers can't discover site purpose.
- **Fix:** Create `/public/llms.txt` with site description, key pages, contact

### H2: FAQ Answers Hidden Behind JS Toggle
- `AnimatePresence` only renders FAQ answer when `isOpen` is true
- AI crawlers and Googlebot may not see answers
- **Fix:** Always render answers in DOM, use CSS to hide/show

### H3: Font Loading Issues
- No `display: "swap"` on Google Fonts (FOIT risk)
- 3 fonts loaded eagerly including Fira Code (only used in code blocks)
- **Fix:** Add `display: "swap"`, lazy-load Fira Code

### H4: Contact Form is Non-Functional
- Uses `setTimeout(resolve, 1500)` — never actually sends
- **Fix:** Wire up to actual email/API

### H5: Privacy Policy Auto-Dates to Today
- `new Date()` generates "Last updated" — always shows current date
- **Fix:** Hardcode the actual last-updated date

### H6: OG Image Inconsistency
- Homepage: `opengraph-image.png`
- 404 page: `logo/og2.png` and `og-marketing.png`
- Root layout: different OG vs Twitter images
- **Fix:** Standardize to one OG image path

---

## MEDIUM Priority Issues

### M1: Sitemap Quality
- All 98 URLs share identical `lastmod` timestamp
- Near-flat priority (0.8 for 96/98 pages)
- `/sign-in`, `/sign-up`, `/chat` included (no search value)
- Deprecated `<changefreq>` and `<priority>` tags (Google ignores them)
- **Fix:** Dynamic lastmod per page, remove auth pages, drop deprecated tags

### M2: Missing Schema Opportunities
- No `AggregateRating` from testimonials
- BlogPosting missing `image` (blocks Article rich results)
- Organization missing `sameAs` (social profiles)
- SearchAction points to `?query=` but blog uses `?q=`
- No schema on `/blog`, `/tools`, `/how-it-works`, `/pricing`

### M3: E-E-A-T Gaps
- Testimonials use pravatar.cc placeholder avatars
- Blog defaults to "IndexFast Editorial Team" with no author bios
- No About/Team page
- No external citations or press mentions

### M4: Accessibility
- Missing `aria-label` on hamburger menu and dark mode toggle
- No skip-to-content link
- Hamburger button 36x36px (below 48px minimum)
- Dark mode FOUC (defaults to "dark" on server)

### M5: Dead/Duplicate Code
- `BlogPostLayout.tsx` has unused schema markup
- Some tool pages have duplicate SoftwareApplication blocks

---

## LOW Priority Issues

- `/blog` and `/blogs` both serve 200 (some agents report redirect, needs verification)
- MCP section and FinalCTA hardcoded dark — ignore light/dark theme
- 10px text for badges is extremely small
- Terracotta primary on white is borderline WCAG AA (4.6:1)

---

## What's Working Well

| Area | Status |
|------|--------|
| Security headers | HSTS, nosniff, DENY, referrer-policy, permissions-policy |
| robots.txt | Allows all major AI crawlers, blocks admin/api |
| Meta tags | Title, description, canonical, OG, Twitter cards present |
| Tools directory | 35+ native tools, 80+ curated external — excellent |
| Blog content | 37+ server-rendered posts with proper structure |
| MCP positioning | "First MCP-native indexing platform" — unique differentiator |
| Brotli compression | 86-87% savings on text assets |
| Font loading | `font-display: swap` on all 21 declarations |

---

## Implementation Roadmap

### Week 1 — Critical Rendering Fixes
1. Server-render landing page content (extract from `"use client"`)
2. Fix JSON-LD to use plain `<script>` tags
3. Resolve www/non-www mismatch
4. Remove duplicate blog posts, add 301 redirects

### Week 2 — Performance & Schema
5. Lazy-load Stack Auth (dashboard only)
6. Replace Framer Motion with CSS animations
7. Create `/public/llms.txt`
8. Fix FAQ rendering (always in DOM)
9. Add missing schema (AggregateRating, BlogPosting image)

### Week 3 — Content & Polish
10. Fix contact form (real functionality)
11. Fix Privacy Policy date
12. Standardize OG images
13. Improve sitemap (dynamic lastmod, remove auth pages)
14. Add font-display swap
15. Fix accessibility issues
