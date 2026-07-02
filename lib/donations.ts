import fs from 'fs'
import path from 'path'
import { Donation } from '@/types'

const DB_PATH = path.join(process.cwd(), 'data', 'donations.json')

export function readDonations(): Donation[] {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function writeDonations(donations: Donation[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(donations, null, 2))
}

export function getApprovedDonations(): Donation[] {
  return readDonations().filter(d => d.status === 'approved')
}

export function getTotalRaised(): number {
  return getApprovedDonations().reduce((sum, d) => sum + d.amount, 0)
}
