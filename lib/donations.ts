/**
 * lib/donations.ts
 * Ref FTTG-82
 *
 * All donation data access goes through this module.
 * Previously read/wrote data/donations.json — now queries PostgreSQL via lib/db.ts.
 *
 * DB schema: see scripts/sql/001_create_tables.sql
 */

import pool from './db'
import { Donation, DonationStatus } from '@/types'
import { QueryResultRow } from 'pg'

// Map DB row (snake_case) → Donation interface (camelCase)
function rowToDonation(row: QueryResultRow): Donation {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    displayName: row.display_name as string,
    amount: Number(row.amount),
    anonymous: row.anonymous as boolean,
    contact: row.contact as string | undefined ?? undefined,
    status: row.status as DonationStatus,
    submittedAt: (row.submitted_at as Date).toISOString(),
    reviewedAt: row.reviewed_at
      ? (row.reviewed_at as Date).toISOString()
      : undefined,
  }
}

/** All donations, newest first. Used by admin dashboard. */
export async function getAllDonations(): Promise<Donation[]> {
  const { rows } = await pool.query(
    `SELECT * FROM donations ORDER BY submitted_at DESC`
  )
  return rows.map(rowToDonation)
}

/** Approved donations only, newest first. Used on the public homepage. */
export async function getApprovedDonations(): Promise<Donation[]> {
  const { rows } = await pool.query(
    `SELECT * FROM donations WHERE status = 'approved' ORDER BY submitted_at DESC`
  )
  return rows.map(rowToDonation)
}

/** Sum of all approved donation amounts. Used for progress display. */
export async function getTotalRaised(): Promise<number> {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM donations WHERE status = 'approved'`
  )
  return Number(rows[0].total)
}

/** Insert a new pending donation submitted via the confirmation modal. */
export async function insertDonation(donation: Donation): Promise<void> {
  await pool.query(
    `INSERT INTO donations
       (id, full_name, display_name, amount, anonymous, contact, status, submitted_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      donation.id,
      donation.fullName,
      donation.displayName,
      donation.amount,
      donation.anonymous,
      donation.contact ?? null,
      donation.status,
      donation.submittedAt,
    ]
  )
}

/** Approve or reject a donation. Sets reviewed_at to NOW(). */
export async function updateDonationStatus(
  id: string,
  status: DonationStatus
): Promise<Donation | null> {
  const { rows } = await pool.query(
    `UPDATE donations
     SET status = $2, reviewed_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, status]
  )
  return rows.length > 0 ? rowToDonation(rows[0]) : null
}
