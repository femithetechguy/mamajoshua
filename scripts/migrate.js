/**
 * migrate.js
 * Ref FTTG-103 / FTTG-82
 *
 * Runs all SQL files in scripts/sql/ in filename order (001_, 002_, ...).
 * Each file is idempotent — safe to re-run without side effects.
 *
 * Usage:
 *   node scripts/migrate.js
 *
 * Requires:
 *   DATABASE_URL in .env.local  (e.g. postgresql://user:pass@host:5432/dbname)
 *
 * Install deps first (one-time):
 *   npm install --save-dev pg dotenv
 */

'use strict'

const path = require('path')
const fs = require('fs')

// Load .env.local — must be called before requiring pg so DATABASE_URL is set
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const { Client } = require('pg')

async function main() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('❌  DATABASE_URL is not set in .env.local')
    process.exit(1)
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()
    console.log('✓ Connected to database')

    const sqlDir = path.join(__dirname, 'sql')
    const files = fs
      .readdirSync(sqlDir)
      .filter(f => f.endsWith('.sql'))
      .sort() // runs 001_ before 002_, etc.

    if (files.length === 0) {
      console.log('No SQL files found in scripts/sql/')
      return
    }

    for (const file of files) {
      const filePath = path.join(sqlDir, file)
      const sql = fs.readFileSync(filePath, 'utf-8')

      console.log(`\nRunning ${file} ...`)
      await client.query(sql)
      console.log(`✓ ${file} complete`)
    }

    console.log('\n✅  Migration complete')
  } catch (err) {
    console.error('\n❌  Migration failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
