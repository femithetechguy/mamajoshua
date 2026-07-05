-- =============================================================================
-- 001_create_tables.sql
-- Ref FTTG-103 / FTTG-82
--
-- Creates the donations table for the mamajoshua fundraiser.
-- Idempotent — safe to run multiple times (IF NOT EXISTS).
--
-- Run via:  node scripts/migrate.js
-- Requires: DATABASE_URL in .env.local
-- =============================================================================

-- Enable pgcrypto for gen_random_uuid() if not already enabled.
-- Required on some hosted Postgres providers (e.g. Supabase, Railway).
-- Safe no-op if already enabled.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- donations
-- Source: data/donations.json (FTTG-82)
--
-- Columns:
--   id           — UUID, carried over from JSON data
--   full_name    — donor's real name (kept private, visible to admin only)
--   display_name — shown publicly ("Anonymous" if donor chose that)
--   amount       — USD, must be > 0
--   anonymous    — whether donor chose to be listed as Anonymous
--   contact      — optional phone or email for verification (FTTG-89)
--   status       — lifecycle: pending → approved | rejected
--   submitted_at — when the donor submitted the confirmation form
--   reviewed_at  — when an admin approved or rejected (nullable until reviewed)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donations (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT            NOT NULL,
  display_name  TEXT            NOT NULL,
  amount        NUMERIC(10, 2)  NOT NULL CHECK (amount > 0),
  anonymous     BOOLEAN         NOT NULL DEFAULT FALSE,
  contact       TEXT,
  status        TEXT            NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ
);

-- Index: homepage queries filter by status='approved' and order by submitted_at DESC
CREATE INDEX IF NOT EXISTS idx_donations_status
  ON donations (status);

CREATE INDEX IF NOT EXISTS idx_donations_submitted_at
  ON donations (submitted_at DESC);
