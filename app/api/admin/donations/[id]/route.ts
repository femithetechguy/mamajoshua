import { NextRequest, NextResponse } from 'next/server'
import { readDonations, writeDonations } from '@/lib/donations'
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

  const donations = readDonations()
  const index = donations.findIndex(d => d.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Donation not found' }, { status: 404 })
  }

  donations[index].status = status
  writeDonations(donations)

  return NextResponse.json({ success: true })
}
