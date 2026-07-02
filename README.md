# mamajoshua

Funeral fundraising site for the Joshua family. Donors send via Zelle, confirm on the site, and the admin approves donations.

**Live:** TBD (Vercel)  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · JSON data store

## Dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Content

Edit `data/site.json` to update the page (name, goal, Zelle contact, story).  
Edit `data/donations.json` to manage donations locally.

## Admin

Visit `/admin` and enter the password from `.env.local → ADMIN_PASSWORD`.

## Docs

See `CLAUDE.md` for full architecture and `PROGRESS.md` for session history.
