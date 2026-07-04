/**
 * lib/db.ts
 * Ref FTTG-82
 *
 * Singleton pg Pool for serverless Next.js on Vercel.
 * Uses a global to prevent multiple Pool instances during hot-reload in dev.
 *
 * Requires DATABASE_URL in .env.local (and in Vercel env vars for production).
 */

import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

// Detect localhost so we don't force SSL on local Postgres.
// For all hosted providers (Supabase, Railway, Neon, etc.) SSL is always on.
const isLocal = process.env.DATABASE_URL?.includes('localhost') ||
                process.env.DATABASE_URL?.includes('127.0.0.1')

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // Explicit ssl object silences the pg sslmode deprecation warning.
    // rejectUnauthorized: false accepts self-signed certs (required by most
    // hosted providers). Local connections skip SSL entirely.
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 5, // keep pool small — Vercel functions are short-lived
  })

if (process.env.NODE_ENV !== 'production') {
  global._pgPool = pool
}

export default pool
