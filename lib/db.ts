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

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
    max: 5, // keep pool small — Vercel functions are short-lived
  })

if (process.env.NODE_ENV !== 'production') {
  global._pgPool = pool
}

export default pool
