# IndexFast Dashboard: Detailed Implementation Plan

This document outlines the end-to-end architecture, flow, and technical implementation for the IndexFast dashboard. It follows high-end design principles and backend best practices to ensure a scalable, "earnings-first" SaaS product.

---

## 🏗️ 1. Architecture & Folder Structure

We follow a **Feature-Based Module** structure within the `src/` directory to keep the codebase organized and maintainable.

```bash
src/
├── app/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/       # Main overview
│   │   ├── sites/           # Site management
│   │   ├── submissions/     # Indexing history & logs
│   │   └── settings/        # User & API settings
│   ├── api/                 # Backend API endpoints & Webhooks
│   └── (landing)/           # Marketing pages
├── components/
│   ├── dashboard/           # Dashboard-specific UI components
│   ├── ui/                  # Shared primitive components (MUI/Tailwind)
│   └── shared/              # Reusable layout elements
├── lib/
│   ├── api/                 # API wrappers (GSC, Bing, IndexNow)
│   ├── db/                  # Drizzle schema & Postgres clients
│   ├── services/            # Core business logic (Sitemap diffing, etc.)
│   └── utils/               # Helper functions
├── hooks/                   # Custom React hooks
└── types/                   # Shared TypeScript definitions
```

---

## 🚀 2. Backend & Frontend Flow

### **A. Core Dashboard Loop**
1. **Frontend**: The user lands on the dashboard, which fetches their verified sites and recent indexing activity via **Next.js Server Components**.
2. **Backend**: Fetches data from **Postgres** (optimised using **Drizzle ORM**) and returns it to the client.
3. **Real-time Updates**: Use **Optimistic UI** for actions like "Force Sync" or "Delete Site" to ensure a snappy, "fast" experience.

### **B. Sitemap & URL Diffing Logic**
To avoid redundant API calls and respect quotas, we use a **Hash-Based Diffing Strategy**:
1. **Fetch**: The backend fetches the `sitemap.xml`.
2. **Parse**: Extract all URLs and their `lastmod` (if available).
3. **Diff**: Compare the current list of URLs against the `SubmissionHistory` table in Postgres.
   - **New URLs**: URLs present in the sitemap but not in the database.
   - **Old URLs**: URLs already tracked and successfully indexed.
4. **Action**: Only push **New URLs** to Bing/IndexNow.
5. **Storage**: Store the `url`, `hash` (of content or URL), and `last_submission_date` to prevent re-indexing unless the content changes.

---

## 🔌 3. API Integrations

### **A. Google Search Console (GSC)**
- **OAuth Flow**: Use **Stack Auth** combined with Google OAuth scopes (`indexing`, `searchconsole.readonly`).
- **One-Click Import**: Fetch the list of verified sites using the `searchconsole.sites.list` API and allow the user to add them to IndexFast with one click.
- **Metadata Sync**: Import site health data (errors, warnings) to display in the dashboard.

### **B. Bing API & IndexNow**
- **Bing Batch Submission**: Use the `SubmitUrlbatch` endpoint for high-volume URL pushes.
- **IndexNow Protocol**: Send a POST request to `https://www.bing.com/indexnow` with the host, key, and URL list.
- **Verification**: Automate the placement of `indexnow.txt` and verify its accessibility before submission.

---

## 💰 4. Pro Features & Payment Integration

### **A. Dodo Payments Integration**
- **Checkout**: Use **Dodo Payments** for a seamless, global checkout experience.
- **Webhooks**: Listen for `subscription.created` and `subscription.updated` events to toggle "Pro" features in the database.
- **Customer Portal**: Provide a direct link to the Dodo Payments portal for subscription management.

### **B. Feature Differentiation**
| Feature | Free Tier | Pro Tier |
| :--- | :--- | :--- |
| **Sites** | 1 Site | Unlimited |
| **Sync Frequency** | Manual | Every 6 Hours (Cron) |
| **URL Quota** | 50 / month | Unlimited |
| **Batch Processing** | ❌ | ✅ |
| **GSC Metadata** | Basic | Advanced |
| **Email Alerts** | ❌ | ✅ |

---

## 🛠️ 5. Best Development Practices (Skill-Aligned)

### **A. Database (Supabase/Postgres Skills)**
- **Optimised Queries**: Use indexes on `url`, `property_id`, and `user_id` for sub-millisecond lookups.
- **Connection Management**: Use **PgBouncer** or **Supabase Pooling** to handle concurrent requests from serverless functions.
- **RLS**: Implement Row-Level Security to ensure users can only access their own data.

### **B. Frontend (Frontend Design Skill)**
- **Distinctive Aesthetics**: Move away from generic purple gradients. Use a "Dark Editorial" or "Brutalist Minimal" look with high-contrast typography (e.g., *Clash Display* or *Patrick Hand* for accents).
- **Motion**: Use `framer-motion` for staggered reveals and micro-interactions on the dashboard charts and tables.
- **Spatial Composition**: Use asymmetrical layouts and generous whitespace to make the data feel less overwhelming.

### **C. Audit & SEO (Audit Website Skill)**
- **Performance**: Ensure a **100 Lighthouse score** for the dashboard to practice what we preach.
- **Accessibility**: Full keyboard navigation and ARIA support for all dashboard components.
- **Secret Detection**: Ensure no API keys or sensitive GSC credentials are ever exposed in client-side code.

---

## 🔐 6. Stack Auth Implementation
- **Seamless Integration**: Use Stack Auth's `useUser` and `useStackApp` hooks for session management.
- **Protected Routes**: Wrap dashboard routes in a middleware or high-level layout that redirects unauthenticated users to `/sign-in`.
- **User Metadata**: Store Pro status and API keys in the user's `metadata` or a linked Postgres profile table.

---

## 📈 7. Roadmap to Launch
1. **V0.1**: Basic GSC site import and manual "Push to IndexNow" button.
2. **V0.2**: Automated Sitemap Cron (running every 6 hours).
3. **V0.3**: Dodo Payments integration and Pro tier feature flags.
4. **V0.4**: Advanced analytics and GSC health metadata dashboard.
