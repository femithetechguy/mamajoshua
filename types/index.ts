export type DonationStatus = 'pending' | 'approved' | 'rejected'

export interface Donation {
  id: string
  fullName: string
  displayName: string
  amount: number
  anonymous: boolean
  status: DonationStatus
  submittedAt: string
}
