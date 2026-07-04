# mamajoshua — Progress Log

---

## Session 5 — 2026-07-04

### Work Done

**FTTG-103 — PostgreSQL DB wired to lib/donations.ts:**
- `lib/db.ts` — singleton `pg.Pool` with global caching for hot-reload, SSL auto-detect (localhost vs hosted)
- `lib/donations.ts` — full rewrite; all functions now async and query Postgres
- All callers updated: `app/page.tsx`, `app/opengraph-image.tsx`, `app/api/admin/donations/route.ts`, `app/api/admin/donations/[id]/route.ts`
- `types/index.ts` — added optional `contact` field to `Donation` interface

**FTTG-104 — Auto-approve donations + nodemailer email alert:**
- `app/api/donations/submit/route.ts` — status set to `'approved'` on insert; fires `sendDonationAlert()` fire-and-forget (email failures don't block the API)
- `lib/email.ts` — nodemailer transporter; HTML alert email with donor table, yellow warning box, admin panel link
- `types/nodemailer.d.ts` — minimal type shim (avoids needing `@types/nodemailer` installed)
- `.env.local` — placeholders for `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `NEXT_PUBLIC_BASE_URL`

**FTTG-86/87/88/89 — Mobile fixes, UX polish:**
- Scrollable overlay pattern in `ConfirmModal.tsx` prevents modal expansion when mobile keyboard opens
- iOS zoom fix: all modal inputs bumped to `text-base` (16px)
- Step 1/2 badges in Zelle card and confirm button
- Hero title: `text-[28px]` desktop, `text-[20px]` mobile (2-line max)
- Optional contact input (phone or email) added to ConfirmModal

**FTTG-82 — DB schema + seeding scripts:**
- `scripts/sql/001_create_tables.sql` — idempotent donations table with indexes
- `scripts/sql/002_seed_donations.sql` — 10 seed rows with `ON CONFLICT (id) DO NOTHING`
- `scripts/migrate.js` — reads + runs all `sql/*.sql` files in order via `pg.Client`; loads `DATABASE_URL` from `.env.local` via dotenv
- `scripts/seed.js` — reads `data/donations.json`, inserts via parameterised queries, logs inserted/skipped counts
- Migration ran successfully on Neon Postgres; 10 rows seeded

### Pending

- [ ] **Fill in email env vars** in `.env.local`: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `NEXT_PUBLIC_BASE_URL`
- [ ] **Add all env vars to Vercel** (FTTG-80): `DATABASE_URL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `NEXT_PUBLIC_BASE_URL`, real `ADMIN_PASSWORD`
- [ ] **Delete `app-remake` remote branch** (`git push origin --delete app-remake`)
- [ ] **Open PR develop → main** on GitHub after pushing

### Commit

```
Fixes FTTG-104: auto-approve donations, nodemailer alert, nodemailer type shim
```

Files: `lib/email.ts`, `types/nodemailer.d.ts`, `app/api/donations/submit/route.ts`, `.env.local`, `lib/db.ts`, `package.json`, `package-lock.json`

---

## Session 4 — 2026-07-03

### Work Done

**FTTG-82 — Satori OG image fix:**
- `app/opengraph-image.tsx` — fixed multi-child text node errors by switching to template literals; updated to await async DB calls

**FTTG-86 — Mobile modal fix (initial):**
- `components/ConfirmModal.tsx` — scrollable overlay pattern

### Pending (carried to Session 5)

- See Session 5 above

---

## Session 3 — 2026-07-02

### Work Done

**FTTG-82 — DB wiring groundwork:**
- `lib/db.ts` initial version
- `scripts/` folder scaffolded

---

## Session 2 — 2026-07-01

### Work Done

**FTTG-78 — Content layer added:**
- `data/site.json` — all site copy/config as data: `pageTitle`, `pageDescription`, `deceasedName`, `organizerName`, `goal`, `zelle.{contact,instructions}`, `story[]`
- `lib/config.ts` — `getSiteConfig()` reads and parses `data/site.json`, exports `SiteConfig` type
- `app/layout.tsx` — metadata now sourced from `getSiteConfig()` instead of hardcoded strings; also carries `suppressHydrationWarning` on `<html>`/`<body>` (fixes browser-extension-injected-attribute hydration mismatch)
- `app/page.tsx` — removed hardcoded `GOAL`/`ORGANIZER_NAME`/`DECEASED_NAME`/`ZELLE_CONTACT` constants and inline story paragraphs; now reads everything from `getSiteConfig()`

### Pending

- [ ] Git setup: initial commit on `main`, push `main` + `develop` to https://github.com/femithetechguy/mamajoshua
- [ ] Update `data/site.json` with real values before launch (`goal`, `organizerName`, `deceasedName`, `zelle.contact`, `story`)
- [ ] **FTTG-79** — Add cover photo (`cover.jpg` → `/public`, wire up `next/image` in `app/page.tsx`)
- [ ] **FTTG-80** — Set `ADMIN_PASSWORD` in Vercel env vars
- [ ] **FTTG-81** — Deploy mamajoshua to Vercel (blocked by FTTG-80)
- [ ] **FTTG-82** — Replace JSON file store with persistent database (Vercel KV / Supabase) before real donations go live

---

## Session 1 — 2026-07-01

### Work Done

**Project scaffolded** from `create-next-app` with TypeScript + Tailwind + App Router.

**Data layer built:**
- `types/index.ts` — `Donation` interface + `DonationStatus` type
- `lib/donations.ts` — `readDonations`, `writeDonations`, `getApprovedDonations`, `getTotalRaised`
- `data/donations.json` — initialized as `[]`

**API routes built:**
- `POST /api/donations/submit` — saves pending donation
- `GET /api/admin/donations` — returns all donations (auth gated)
- `PATCH /api/admin/donations/[id]` — approve/reject (auth gated, Next.js 15 async params)

**Pages built:**
- `app/page.tsx` — public fundraiser (server component): cover photo placeholder, progress bar, Zelle card, story, recent approved donations feed
- `app/confirm/page.tsx` — donor form: full name, amount, anonymous radio, POST to API, success state
- `app/admin/page.tsx` — password gate → dashboard with pending/approved/rejected sections, approve/reject buttons per row

**Config:**
- `app/layout.tsx` — metadata set, Geist fonts removed
- `app/globals.css` — minimal Tailwind import + body base
- `.env.local` — `ADMIN_PASSWORD=changeme` (update before deploy)

**Docs:**
- `CLAUDE.md` — architecture, file map, types, API docs, auth notes, customization constants
- `PROGRESS.md` — this file

**Build verified:** `tsc --noEmit` passes clean.

### Pending
- [ ] Git setup: initial commit on `main`, push `main` + `develop` to https://github.com/femithetechguy/mamajoshua
- [ ] **FTTG-78** — Update site constants before launch (`GOAL`, `ORGANIZER_NAME`, `DECEASED_NAME`, `ZELLE_CONTACT` in `app/page.tsx`)
- [ ] **FTTG-79** — Add cover photo (`cover.jpg` → `/public`, wire up `next/image` in `app/page.tsx`)
- [ ] **FTTG-80** — Set `ADMIN_PASSWORD` in Vercel env vars
- [ ] **FTTG-81** — Deploy mamajoshua to Vercel (blocked by FTTG-78 + FTTG-80)
- [ ] **FTTG-82** — Replace JSON file store with persistent database (Vercel KV / Supabase) before real donations go live

### Commit Format
```
Fixes FTTG-XX: what you changed    ← closes the issue
Ref FTTG-XX: what you changed      ← progress, issue stays open
feat/fix/chore: what you changed   ← for work without a Linear issue
```

Example commits per issue:
- `Fixes FTTG-78: update GOAL, ORGANIZER_NAME, DECEASED_NAME, ZELLE_CONTACT`
- `Fixes FTTG-79: add cover photo via next/image`
- `Fixes FTTG-80: add ADMIN_PASSWORD to Vercel env vars`
- `Fixes FTTG-81: connect mamajoshua to Vercel and deploy`
- `Fixes FTTG-82: replace JSON file store with Vercel KV`

---

### Key Observations
- `process.env.ADMIN_PASSWORD` is read at request time — no build-time exposure
- `data/donations.json` is written at runtime — works fine on local dev; on Vercel, filesystem is read-only at runtime, so a database (e.g. Vercel KV, Supabase) will be needed for production persistence
- Next.js 15 requires `params` to be awaited: `const { id } = await params`
