# mamajoshua — Progress Log

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
