// Ref FTTG-104 — auto-approve donations + nodemailer alert on submission
// Ref FTTG-82  — PostgreSQL insert via lib/donations
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { insertDonation } from '@/lib/donations'
import { sendDonationAlert } from '@/lib/email'
import { Donation } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, amount, contact, anonymous } = body

    if (!fullName || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const donation: Donation = {
      id: randomUUID(),
      fullName: fullName.trim(),
      displayName: anonymous ? 'Anonymous' : fullName.trim(),
      amount: Number(amount),
      anonymous: Boolean(anonymous),
      contact: contact?.trim() || undefined,
      // Auto-approved — shows on page immediately.
      // Reject suspicious entries via /admin if needed.
      status: 'approved',
      submittedAt: new Date().toISOString(),
    }

    await insertDonation(donation)

    // Await email — Vercel functions shut down immediately after response,
    // so fire-and-forget never completes in production.
    try {
      await sendDonationAlert(donation)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[email] Failed to send donation alert:', msg)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
