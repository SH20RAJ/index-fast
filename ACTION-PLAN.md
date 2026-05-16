# IndexFast SEO Action Plan
**Prioritized by Impact × Effort**

---

## CRITICAL — Fix This Week (Blocks Indexing)

### 1. Server-Render Landing Page Content
**Impact: CRITICAL | Effort: 2-3 days**
- [ ] Extract static Hero content (H1, checklist, stats) into a Server Component
- [ ] Only CTA button (auth-dependent `useUser()`) stays as client component
- [ ] Apply same pattern to Features, HowItWorks, Pricing, FAQ sections
- [ ] Verify Googlebot sees full content via URL Inspection Tool

**Files:** `src/components/landing/Hero.tsx`, `src/app/(landing)/page.tsx`

### 2. Fix JSON-LD Rendering
**Impact: CRITICAL | Effort: 30 min**
- [ ] Root layout: Replace `<Script strategy="beforeInteractive">` with `<script type="application/ld+json">`
- [ ] Landing page: Move JSON-LD `<script>` to top of JSX return (before child components)
- [ ] Validate with Google Rich Results Test

**Files:** `src/app/layout.tsx`, `src/app/(landing)/page.tsx`

### 3. Resolve WWW/Non-WWW Mismatch
**Impact: CRITICAL | Effort: 15 min**
- [ ] Choose non-www (`indexfast.co`) since server redirects to it
- [ ] Update `sitemap.ts` to use `https://indexfast.co`
- [ ] Update canonical URLs in layout/metadata
- [ ] Update `robots.txt` Host directive
- [ ] Submit updated sitemap to Google Search Console

**Files:** `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/app/robots.ts`

### 4. Remove Duplicate Blog Posts
**Impact: HIGH | Effort: 1 hour**
- [ ] Delete 5 duplicate posts from database
- [ ] Add 301 redirects for old slugs
- [ ] Verify no internal links point to deleted slugs

**Duplicates:**
- `bing-webmaster-vs-google-search-console` → keep `bing-webmaster-tools-vs-google-search-console-2026`
- `indexnow-vs-sitemap-submission` → keep `indexnow-vs-sitemap-submission-2026`
- `ai-search-killing-traditional-seo` → keep `ai-search-killing-traditional-seo-2026`
- `indexnow-secret-10000-pages-24-hours` → keep `indexnow-secret-10k-pages-24h`
- `free-seo-tools-convert-visitors-to-subscribers` → keep `free-seo-tools-convert-visitors-subscribers-2026`

---

## HIGH — Fix This Month (Major Impact)

### 5. Create `/public/llms.txt`
**Impact: HIGH | Effort: 1 hour**
- [ ] Create `/public/llms.txt` with site description, key pages, tools list
- [ ] Include MCP integration details (differentiator for AI search)
- [ ] Add contact info

### 6. Lazy-Load Stack Auth
**Impact: HIGH | Effort: 1 day**
- [ ] Move Stack Auth SDK import to dashboard routes only
- [ ] Landing page uses simple `<a href="/sign-in">` link instead of auth-aware CTA
- [ ] Saves 565 KB raw / 120 KB Brotli

### 7. Replace Framer Motion with CSS
**Impact: HIGH | Effort: 2 days**
- [ ] Audit all `motion.div` usage in landing components
- [ ] Replace with CSS `@keyframes`, `transition`, `animation`
- [ ] Saves 324 KB raw / 96 KB Brotli

### 8. Fix FAQ Rendering for AI/Google
**Impact: HIGH | Effort: 2 hours**
- [ ] Always render FAQ answers in DOM (not conditionally via `AnimatePresence`)
- [ ] Use CSS `max-height: 0` / `overflow: hidden` for collapsed state
- [ ] Verify with Google Rich Results Test

### 9. Fix Font Loading
**Impact: MEDIUM | Effort: 30 min**
- [ ] Add `display: "swap"` to all `next/font/google` declarations
- [ ] Lazy-load Fira Code (only used in code blocks)
- [ ] Files: `src/app/layout.tsx`

---

## MEDIUM — Fix Within 2 Months

### 10. Fix Contact Form
- [ ] Wire up to Resend, SendGrid, or similar email API
- [ ] Remove `setTimeout` fake submission

### 11. Fix Privacy Policy Date
- [ ] Hardcode actual last-updated date instead of `new Date()`

### 12. Improve Sitemap
- [ ] Dynamic `lastmod` per page (use actual content update dates)
- [ ] Remove `/sign-in`, `/sign-up`, `/chat`
- [ ] Drop deprecated `<changefreq>` and `<priority>` tags

### 13. Add Missing Schema
- [ ] `AggregateRating` on landing page (from testimonials)
- [ ] `BlogPosting.image` on all blog posts
- [ ] `Organization.sameAs` (social media links)
- [ ] Fix SearchAction parameter (`?q=` not `?query=`)

### 14. Standardize OG Images
- [ ] Pick one image path (e.g., `/og-image.png`)
- [ ] Use consistently across layout, pages, and 404

### 15. Fix Accessibility
- [ ] Add `aria-label` to hamburger menu, dark mode toggle
- [ ] Add skip-to-content link
- [ ] Increase hamburger touch target to 48px
- [ ] Fix dark mode FOUC

---

## LOW — Backlog

- [ ] Verify `/blogs` redirect to `/blog` (conflicting reports)
- [ ] Remove hardcoded dark mode from MCP section and FinalCTA
- [ ] Increase micro-copy font size (10px → 12px)
- [ ] Improve contrast ratio on terracotta primary

---

## Quick Wins (< 15 min each)

| Task | File | Time |
|------|------|------|
| Fix robots.txt Host to non-www | `src/app/robots.ts` | 5 min |
| Add OAI-SearchBot + CCBot to robots.txt | `src/app/robots.ts` | 5 min |
| Remove auth pages from sitemap | `src/lib/public-site-paths.ts` | 10 min |
| Add font-display swap | `src/app/layout.tsx` | 10 min |
| Fix Privacy Policy date | privacy page component | 5 min |

---

## Monitoring

After fixes, verify with:
- [ ] Google Search Console → URL Inspection → Test Live URL
- [ ] Google Rich Results Test (JSON-LD validation)
- [ ] PageSpeed Insights (CWV re-measurement)
- [ ] `curl -sL https://indexfast.co | grep "h1"` (verify SSR content)
- [ ] ChatGPT/Claude search for "IndexFast" (AI visibility)
