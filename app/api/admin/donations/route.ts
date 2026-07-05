// Ref FTTG-82 — switched from JSON file to PostgreSQL
import { NextRequest, NextResponse } from 'next/server'
import { getAllDonations } from '@/lib/donations'

function isAuthorized(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password')
  return password === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const donations = await getAllDonations()
  return NextResponse.json(donations)
}
