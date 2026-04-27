# Outpulse UI

Premium dark-themed dashboard frontend for the Outpulse B2B lead generation platform. Connects to the Outpulse REST API to ingest company URLs, run the discovery + scoring pipeline, and display ranked leads with full evidence and contact information.

**Live**: https://outpulse-ui.vercel.app
**Backend**: https://outpulse-production.up.railway.app

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives)
- **TanStack Query v5** (server state, caching)
- **Sonner** (toasts), **Lucide React** (icons)

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard home — stat cards, recent runs, quick actions |
| `/onboarding` | URL input → animated pipeline progress → ICP review |
| `/leads?icp_id={id}` | Sortable leads table with detail drawer |
| `/runs` | Pipeline run history |
| `/settings` | Account / Billing / API Keys placeholder |

## Local Development

```bash
npm install
cp .env.example .env.local   # then fill in OUTPULSE_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Var | Required | Description |
|-----|----------|-------------|
| `OUTPULSE_API_KEY` | yes | Backend API key. Injected server-side by the proxy route — never sent to the browser. |
| `OUTPULSE_BACKEND_URL` | no | Override the upstream backend URL. Defaults to the Railway prod URL. |

## Verification

The project ships with a verification script that exercises the proxy security behaviour end-to-end (path allowlist, missing-key handling, error sanitization).

```bash
# Type-check + lint + production build
npx tsc --noEmit
npm run lint
npx next build

# Live proxy smoke tests (against http://localhost:3000 by default)
npm run smoke

# Or against a deployed environment (skips the S2 restart test):
npm run smoke -- https://outpulse-ui.vercel.app
```

The smoke script covers:

- **S1** — Path allowlist rejects unknown routes (`/api/admin`, `/api/secret`, `/api/admin/users`) with HTTP 404
- **S1** — Allowlisted routes (`/api/health`, `/api/runs`) return HTTP 200
- **S2** — Missing `OUTPULSE_API_KEY` returns HTTP 500 with "Server misconfiguration" (localhost only — restarts the dev server without the key, then restores it)
- **S3** — Upstream errors are sanitized to `{detail: ...}` only — no Python tracebacks, file paths, or internal hints leak to the client

A clean run shows `PASS 11 checks ✓`.

## Deployment

Currently deployed on Vercel:

```bash
vercel --prod
```

Set `OUTPULSE_API_KEY` (and optionally `OUTPULSE_BACKEND_URL`) in the Vercel project's environment variables before deploying.

The `/api/[...path]` route handler proxies long-running pipeline requests with `maxDuration = 300`. On Vercel Hobby this is capped at 60 seconds — the pipeline endpoint can take 60-180s, so Hobby plans may time out. Upgrade to Pro for longer execution.

## Project Structure

```
src/
  app/
    layout.tsx
    page.tsx                 # Dashboard (Suspense wrapper)
    dashboard-content.tsx
    onboarding/page.tsx
    leads/{page,leads-content}.tsx
    runs/{page,runs-content}.tsx
    settings/page.tsx
    api/[...path]/route.ts   # Allowlisted proxy with key injection + error sanitization
  lib/
    api-client.ts            # fetch wrapper with AbortSignal.any() + activity logging
    api/                     # per-endpoint modules
    types/index.ts
    constants.ts             # NAV_ITEMS, tier colors, pipeline steps
    format.ts
  hooks/                     # use-pipeline, use-leads, use-runs, use-animated-value
  components/
    providers.tsx
    ui/                      # shadcn + custom (animated-number, circular-progress, stat-card, gradient-pill)
    layout/                  # sidebar, mobile-nav, app-shell
    activity-log/
    pipeline/                # active-pipeline-context (run lock, sessionStorage recovery)
    onboarding/
    leads/
    runs/
scripts/
  smoke-test.sh              # live proxy verification
```
