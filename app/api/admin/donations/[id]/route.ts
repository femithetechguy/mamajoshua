// Ref FTTG-82 — switched from JSON file to PostgreSQL
import { NextRequest, NextResponse } from 'next/server'
import { updateDonationStatus } from '@/lib/donations'
import { DonationStatus } from '@/types'

function isAuthorized(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json() as { status: DonationStatus }

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await updateDonationStatus(id, status)

  if (!updated) {
    return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
