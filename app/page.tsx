import { getApprovedDonations, getTotalRaised } from '@/lib/donations'
import { Donation } from '@/types'

const GOAL = 10000
const ORGANIZER_NAME = 'Family Member'    // ← update
const DECEASED_NAME = 'Mama Joshua'       // ← update
const ZELLE_CONTACT = 'your@email.com'   // ← update

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (mins > 0) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  return 'just now'
}

export default async function Home() {
  const approved: Donation[] = getApprovedDonations()
  const totalRaised = getTotalRaised()
  const progressPct = Math.min((totalRaised / GOAL) * 100, 100)

  return (
    <main className="max-w-xl mx-auto px-4 py-8 space-y-8">

      {/* Cover photo */}
      <div className="w-full h-56 bg-gray-200 rounded-lg overflow-hidden">
        {/* Swap placeholder: add cover.jpg to /public and use next/image */}
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          Cover photo — add cover.jpg to /public
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Help Us Lay {DECEASED_NAME} to Rest
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Organized by {ORGANIZER_NAME} · Family Member
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>${totalRaised.toLocaleString()} raised</span>
          <span>${GOAL.toLocaleString()} goal</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-600 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {approved.length} donation{approved.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Zelle instructions */}
      <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-1">
        <p className="font-medium text-gray-800">How to donate via Zelle</p>
        <p className="text-sm text-gray-600">
          Send to: <span className="font-mono text-gray-900">{ZELLE_CONTACT}</span>
        </p>
        <p className="text-sm text-gray-600">Include your name in the memo.</p>
      </div>

      {/* Story */}
      <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
        <p>
          Our beloved {DECEASED_NAME} passed away and left behind a family that is grieving deeply.
          We are reaching out to our community for support during this difficult time.
        </p>
        <p>
          The funds raised will go directly toward funeral arrangements, burial costs, and
          ensuring that {DECEASED_NAME} receives a dignified farewell surrounded by love.
        </p>
        <p>
          Every contribution, no matter the size, means the world to us. Thank you for
          standing with our family in this moment of loss.
        </p>
      </div>

      {/* Confirm link */}
      <div className="text-center">
        <a
          href="/confirm"
          className="inline-block text-sm text-stone-700 underline underline-offset-4 hover:text-stone-900"
        >
          Already donated? Confirm your donation here →
        </a>
      </div>

      {/* Recent donations */}
      {approved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Recent donations
          </h2>
          <ul className="space-y-3">
            {approved.map(d => (
              <li
                key={d.id}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{d.displayName}</p>
                  <p className="text-xs text-gray-400">{timeAgo(d.submittedAt)}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  ${d.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </main>
  )
}
