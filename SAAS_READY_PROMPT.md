# Master Prompt: Make IndexFast SaaS-Ready

You are an expert SaaS Architect and Lead Frontend Engineer. Your mission is to transform the **IndexFast** codebase from a functional prototype into a world-class, production-ready SaaS product with Apple-level design polish and robust business logic.

---

## 🎨 Phase 1: High-End Design & UX Polish
- **Aesthetic**: Implement a high-polish minimalist design using the **OKLCH** color palette defined in `globals.css`. Focus on warm earth tones, subtle glassmorphism (`backdrop-blur`), and a "breathable" layout.
- **Motion**: Use `framer-motion` for micro-interactions:
  - Staggered entry animations for dashboard cards.
  - Smooth transitions between dashboard tabs.
  - Subtle hover effects that feel "premium" (not generic).
- **Empty States**: Create beautiful, illustrative empty states for the URL Inventory and Submission history to guide users on their first visit.
- **Feedback**: Implement a unified notification system using `sonner` for all Server Action results (Success/Error/Pending).

## 🚀 Phase 2: Frictionless Onboarding
- **Add Site Wizard**: Overhaul `AddSiteFlow.tsx` into a high-converting 3-step process:
  1. **Source**: Enter URL or connect Google Search Console.
  2. **Discovery**: Auto-detect sitemaps and list found URLs with "potential indexing" estimates.
  3. **Activation**: Configure cron frequency and engine selection.
- **Guided Tours**: Add a "Quick Start" checklist on the dashboard for new users.

## 💳 Phase 3: Billing & Subscription Lifecycle
- **Tier Enforcement**: Hard-lock features based on the user's plan (Free vs Pro vs Agency).
  - Enforce website limits in the `addWebsiteAction`.
  - Disable "Auto-Sitemap Sync" and "Universal Pings" for Free users.
- **Subscription Management**: 
  - Integrate the Dodo Payments portal link in the Settings page.
  - Handle "Past Due" or "Canceled" states gracefully in the UI.
  - Implement a "Pricing Comparison" modal for easy upgrades.

## 🛠️ Phase 4: Admin & Operations
- **Internal Dashboard**: Build a secure `/admin` route (RBAC via Stack Auth) to:
  - Monitor real-time MRR and user growth.
  - View "Failed Submissions" across the whole platform to identify API issues.
  - Manually trigger or pause global cron jobs for maintenance.
- **Logging**: Enhance the `LogProvider` to capture critical business events (upgrades, sync failures).

## 📈 Phase 5: SEO & Content Engine
- **Tools Directory**: Programmatically generate 80+ tool pages from `src/lib/tools-catalog.ts` using the `(tools)/tools/[slug]` pattern. Each page must be highly SEO-optimized with specific meta tags and schema markup.
- **Blog Engine**: Finalize the `/blog` section to render content from `src/lib/blog-catalog.ts`. Implement a clean, readable layout optimized for long-form technical SEO content.
- **Sitemap & Robots**: Ensure the dynamically generated `sitemap.ts` and `robots.ts` include all tools and blog posts.

## 📧 Phase 6: Communication & Retention
- **Email Notifications**: Integrate a service (Resend or Postmark) to:
  - Send a "Weekly Indexing Report" to Pro users.
  - Alert users if their GSC token expires or a sitemap becomes unreachable.
- **Direct Support**: Connect the `ChatBot` component to the backend AI assistant to handle common support queries using the NVIDIA API.

---

## 🛠️ Technical Constraints
- **Framework**: Next.js 16 (App Router) + React 19.
- **Data**: Drizzle ORM + PostgreSQL. Always use Server Actions for mutations.
- **Auth**: Stack Auth (RBAC).
- **Performance**: Maintain 95+ scores on Lighthouse for Performance and SEO.
- **Mobile**: 100% responsive design with "App-like" feel on mobile browsers.
