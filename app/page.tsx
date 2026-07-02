import { getApprovedDonations, getTotalRaised } from '@/lib/donations'
import { getSiteConfig } from '@/lib/config'
import { Donation } from '@/types'
import Image from 'next/image'
import CopyButton from '@/components/CopyButton'
import CTAWithShare from '@/components/CTAWithShare'
import AnimatedDonut from '@/components/AnimatedDonut'
import AnimatedCounter from '@/components/AnimatedCounter'

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

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = ['bg-slate-600', 'bg-stone-500', 'bg-zinc-600', 'bg-neutral-600']

// SVG donut chart — server-rendered, no JS needed
function DonutChart({ pct }: { pct: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const filled = (pct / 100) * circ
  const label = pct < 1 ? '<1%' : `${Math.round(pct)}%`

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        {/* Fill */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      {/* Label in center */}
      <div className="absolute inset-0 flex items-center justify-center rotate-0">
        <span className="text-xs font-black text-gray-800">{label}</span>
      </div>
    </div>
  )
}

const CoverPhoto = ({ className }: { className?: string }) => (
  <div className={`relative bg-slate-900 overflow-hidden ${className}`}>
    <Image
      src="/cover.jpeg"
      alt="Mrs Rose Joshua"
      fill
      className="object-cover"
      style={{ objectPosition: '50% 0%' }}
      priority
    />
  </div>
)

export default async function Home() {
  const config = getSiteConfig()
  const approved: Donation[] = getApprovedDonations()
  const totalRaised = getTotalRaised()
  const progressPct = Math.min((totalRaised / config.goal) * 100, 100)

  return (
    <main className="min-h-screen">

      {/* ── MOBILE hero with name overlay ── */}
      <div className="relative lg:hidden">
        <CoverPhoto className="w-full h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Fundraiser · {config.organizerName}
          </p>
          <h1 className="text-2xl font-bold text-white leading-snug">
            Help Us Lay {config.deceasedName} to Rest
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto lg:px-10 lg:py-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_390px] lg:gap-10 lg:items-start">

          {/* ════ LEFT: hero (desktop) + story + share ════ */}
          <div className="order-2 lg:order-1 space-y-4">

            {/* Desktop hero */}
            <div className="hidden lg:block relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
              <CoverPhoto className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-8 py-7">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Fundraiser · {config.organizerName}
                </p>
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Help Us Lay {config.deceasedName} to Rest
                </h1>
              </div>
            </div>

            {/* Story */}
            <div className="bg-white lg:rounded-2xl px-5 py-7 lg:p-8 shadow-sm border-y lg:border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {config.deceasedName}&apos;s story
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                {config.story.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

          </div>

          {/* ════ RIGHT: action panel ════ */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-8 space-y-3 px-4 py-5 lg:px-0 lg:py-0">

            {/* Progress — donut chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-5">
                <AnimatedDonut pct={progressPct} />
                <div className="flex-1">
                  <div className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                    <AnimatedCounter value={totalRaised} />
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-gray-500">raised of</span>
                    <span className="text-sm font-bold text-gray-800">${config.goal.toLocaleString()}</span>
                    <span className="text-sm font-semibold text-gray-500">goal</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-600">{approved.length} donation{approved.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zelle card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900 text-sm">Send via Zelle</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Send to</p>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{config.zelle.contact}</p>
                </div>
                <CopyButton text={config.zelle.contact} />
              </div>
              <p className="text-xs text-gray-400 mt-2.5 pl-0.5">{config.zelle.instructions}</p>
            </div>

            {/* CTA + Share */}
            <CTAWithShare message={config.shareMessage} />

            {/* Recent donations */}
            {approved.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Recent donations</h3>
                <ul className="divide-y divide-gray-50">
                  {approved.map((d, i) => (
                    <li key={d.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {d.anonymous ? 'A' : getInitials(d.displayName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{d.displayName}</p>
                        <p className="text-xs text-gray-400">{timeAgo(d.submittedAt)}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-800 shrink-0">
                        ${d.amount.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
