import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { readDonations, writeDonations } from '@/lib/donations'
import { Donation } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, amount, anonymous } = body

    if (!fullName || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const donation: Donation = {
      id: randomUUID(),
      fullName: fullName.trim(),
      displayName: anonymous ? 'Anonymous' : fullName.trim(),
      amount: Number(amount),
      anonymous: Boolean(anonymous),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }

    const donations = readDonations()
    donations.unshift(donation)
    writeDonations(donations)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
