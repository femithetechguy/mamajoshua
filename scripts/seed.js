/**
 * seed.js
 * Ref FTTG-103 / FTTG-82
 *
 * Reads data/donations.json at runtime and inserts every record into the
 * donations table using parameterised queries.
 *
 * Safe to re-run — uses ON CONFLICT (id) DO NOTHING so existing rows
 * are never duplicated or overwritten.
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Requires:
 *   DATABASE_URL in .env.local
 *   donations table already created (run migrate.js first)
 *
 * Install deps first (one-time):
 *   npm install --save-dev pg dotenv
 */

'use strict'

const path = require('path')
const fs = require('fs')

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const { Client } = require('pg')

async function main() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌  DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  // Read donations from the JSON file
  const donationsPath = path.resolve(__dirname, '../data/donations.json')
  let donations

  try {
    donations = JSON.parse(fs.readFileSync(donationsPath, 'utf-8'))
  } catch (err) {
    console.error('❌  Could not read data/donations.json:', err.message)
    process.exit(1)
  }

  if (!Array.isArray(donations) || donations.length === 0) {
    console.log('No donations found in data/donations.json — nothing to seed.')
    return
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()
    console.log(`✓ Connected to database`)
    console.log(`  Seeding ${donations.length} donation(s)...\n`)

    let inserted = 0
    let skipped = 0

    for (const d of donations) {
      const result = await client.query(
        `INSERT INTO donations
           (id, full_name, display_name, amount, anonymous, contact, status, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          d.id,
          d.fullName,
          d.displayName,
          d.amount,
          d.anonymous,
          d.contact ?? null,   // contact field added in FTTG-89, may be absent in old records
          d.status,
          d.submittedAt,
        ]
      )

      if (result.rowCount > 0) {
        console.log(`  ✓ Inserted  ${d.displayName}  $${d.amount}  [${d.status}]`)
        inserted++
      } else {
        console.log(`  – Skipped   ${d.displayName}  (id already exists)`)
        skipped++
      }
    }

    console.log(`\n✅  Seed complete — ${inserted} inserted, ${skipped} skipped`)
  } catch (err) {
    console.error('\n❌  Seed failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
