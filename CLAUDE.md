@AGENTS.md

# mamajoshua — Funeral Fundraising Website

## What This Is
A simple funeral fundraising site for the Joshua family. Donors send money via Zelle, then confirm their donation on the site. The admin reviews and approves donations, which then appear on the public page.

**Remote:** https://github.com/femithetechguy/mamajoshua  
**Hosting:** Vercel (planned)  
**Linear Project:** BrotherFemi / FTTG Solutions

---

## Stack
| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| JSON file | Data store (`data/donations.json`) |
| Vercel | Hosting |

---

## Architecture

```
Donor sends Zelle → /confirm (form) → POST /api/donations/submit
                                          ↓
                                   data/donations.json (status: pending)
                                          ↓
                              Admin logs into /admin → PATCH /api/admin/donations/[id]
                                          ↓
                              status: approved → shows on / + counts toward progress bar
```

---

## File Structure
```
app/
  page.tsx                    ← Public fundraiser page (server component)
  confirm/page.tsx            ← Donor confirmation form ('use client')
  admin/page.tsx              ← Password-gated admin dashboard ('use client')
  layout.tsx                  ← Root layout (metadata, global styles)
  globals.css                 ← Minimal: @import "tailwindcss" + body styles
  api/
    donations/submit/route.ts ← POST — save new donation (status: pending)
    admin/donations/route.ts  ← GET — fetch all donations (auth required)
    admin/donations/[id]/route.ts ← PATCH — approve/reject (auth required)
data/
  donations.json              ← Source of truth — initialized as []
lib/
  donations.ts                ← readDonations / writeDonations / getApprovedDonations / getTotalRaised
types/
  index.ts                    ← Donation type + DonationStatus
public/
  (add cover.jpg here for the cover photo)
.env.local                    ← ADMIN_PASSWORD (never commit)
```

---

## Key Types
```typescript
type DonationStatus = 'pending' | 'approved' | 'rejected'

interface Donation {
  id: string           // randomUUID()
  fullName: string     // always stored, even if anonymous
  displayName: string  // 'Anonymous' if anonymous, else fullName
  amount: number
  anonymous: boolean
  status: DonationStatus
  submittedAt: string  // ISO timestamp
}
```

---

## API Routes

### POST /api/donations/submit
- Body: `{ fullName, amount, displayName?, anonymous? }`
- Saves with `status: 'pending'`
- No auth required

### GET /api/admin/donations
- Header: `x-admin-password: <ADMIN_PASSWORD>`
- Returns all donations (all statuses)

### PATCH /api/admin/donations/[id]
- Header: `x-admin-password: <ADMIN_PASSWORD>`
- Body: `{ status: 'approved' | 'rejected' }`

---

## Auth
Admin routes check `x-admin-password` header against `process.env.ADMIN_PASSWORD`.  
Set `ADMIN_PASSWORD` in `.env.local` (local) and in Vercel env vars (production).

**⚠ Never commit `.env.local`** — it's in `.gitignore`.

---

## Customization Constants (app/page.tsx)
```typescript
const GOAL = 10000           // Fundraising goal in dollars
const ORGANIZER_NAME = '...' // Person organizing the fundraiser
const DECEASED_NAME = '...'  // Name of the deceased
const ZELLE_CONTACT = '...'  // Zelle phone/email
```

Update these before going live.

---

## Branch Strategy
- `main` — production (Vercel auto-deploys)
- `develop` — active development; PRs into main
- Feature branches → develop → PR → main

## Linear / Commit Format
```
Fixes FTTG-XX: what you changed
Ref FTTG-XX: what you changed
```

## Conventions
- `data/donations.json` is the source of truth — never hardcode donation data
- Only **approved** donations appear on the public page and count toward the progress bar
- Admin page is client-only — no server-side password exposure
- Do NOT add `Co-Authored-By` lines to commits

---

*Last updated: 2026-07-01 (Session 1 — full site built)*  
> **See PROGRESS.md for session history.**
