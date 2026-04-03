# Redis Plan for IndexFast

This document defines where Redis should be used in the app, why it matters, and how to roll it out safely.

## Goals

- Protect expensive API routes from abuse.
- Reduce repeated work on slow or external requests.
- Prevent duplicate background job or webhook processing.
- Keep the implementation simple and serverless-friendly.

## Current Setup

- The app already has Upstash Redis env variables available in `.env.local`.
- The codebase is a Next.js app with API routes, cron handlers, webhook handlers, and several external API calls.
- Redis should be used as a low-latency support layer, not as the primary database.

## Best Places To Use Redis

### 1. Rate limiting

Use Redis to limit abuse on expensive or externally billed endpoints.

Good candidates:

- `/api/chat`
- `/api/ping`
- `/api/indexnow/submit-all`
- `/api/cron/process`
- payment or webhook endpoints if they can be retried aggressively

Suggested policy:

- Limit by IP for anonymous routes.
- Limit by user ID for authenticated routes.
- Use stricter limits for free plans and higher limits for paid plans.

### 2. Webhook deduplication

Store processed webhook event IDs in Redis with a TTL before applying state changes.

Why:

- Payment providers can retry events.
- Duplicate webhook handling can create repeated subscription updates or double writes.

### 3. Short-lived caching

Cache expensive or repetitive external requests with a small TTL.

Good candidates:

- Google Search Console lists and imports
- NVIDIA chat responses when safe to reuse
- audit responses that are expensive to generate
- site metadata or computed dashboard summaries

Suggested TTLs:

- Fast-changing data: 30-120 seconds
- Moderate data: 5-15 minutes
- Rarely changing data: 1-24 hours

### 4. Distributed locks

Use Redis locks to avoid overlapping background work.

Good candidates:

- `/api/cron/process`
- bulk submission flows
- sitemap or indexing jobs that may be triggered twice

This is especially useful if multiple workers or serverless invocations can overlap.

### 5. Queue or burst buffering

Use Redis when a request should be accepted quickly and processed in batches later.

Good candidates:

- large submission batches
- URL import pipelines
- archive submission bursts

This should only be added if the current direct flow becomes too slow or unreliable.

### 6. Dashboard aggregates

Cache list and summary endpoints that are read often but change less often than they are viewed.

Good candidates:

- submissions history
- website lists
- cron job stats
- plan or usage summaries

Invalidate these keys on writes instead of recomputing on every page load.

## Suggested Key Structure

Use clear prefixes so keys stay easy to inspect and expire safely.

- `ratelimit:chat:{ipOrUserId}`
- `ratelimit:ping:{ipOrUserId}`
- `ratelimit:submit-all:{ipOrUserId}`
- `webhook:dodo:{eventId}`
- `cache:gsc:sites:{userId}`
- `cache:dashboard:submissions:{userId}`
- `lock:cron:process`
- `lock:submit-all`

## Rollout Plan

### Phase 1

- Add a shared Redis client.
- Add rate limiting to high-risk routes.
- Add webhook deduplication.

### Phase 2

- Add short-TTL caching to the most expensive external requests.
- Add distributed locks for cron and bulk submission flows.

### Phase 3

- Add dashboard caching for list and summary data.
- Add queue-style buffering only if request volume justifies it.

## Operational Rules

- Always set TTLs on cache and dedup keys.
- Never store secrets or full raw payloads unless necessary.
- Keep key names predictable and prefixed.
- Prefer Redis for temporary state only; keep canonical records in PostgreSQL.
- Track whether a key is for rate limiting, cache, lock, or deduplication.

## Notes For Implementation

- Create a single Redis client module and reuse it everywhere.
- Use low-risk defaults first, then tighten limits after observing traffic.
- If a route is already protected by database logic, Redis should complement it, not replace it.

## Open Questions

- Which routes should be protected first: chat, ping, or bulk submission?
- Should free-plan users get a different Redis rate limit than paid users?
- Which dashboard pages are read often enough to justify caching immediately?
