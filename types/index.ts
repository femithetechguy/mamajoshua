export type DonationStatus = 'pending' | 'approved' | 'rejected'

export interface Donation {
  id: string
  fullName: string
  displayName: string
  amount: number
  anonymous: boolean
  contact?: string        // optional phone or email for verification (FTTG-89)
  status: DonationStatus
  submittedAt: string
  reviewedAt?: string     // set when admin approves or rejects (FTTG-82)
}
