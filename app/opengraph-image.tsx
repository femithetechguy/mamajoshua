import { ImageResponse } from 'next/og'
import { getSiteConfig } from '@/lib/config'
import { getTotalRaised, getApprovedDonations } from '@/lib/donations'

export const alt = 'Fundraiser — Help Us Lay Mrs Rose Joshua to Rest'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
// Skip static generation — queries the DB and must run at request time
export const dynamic = 'force-dynamic'

export default async function Image() {
  const config = getSiteConfig()
  const [total, donors] = await Promise.all([
    getTotalRaised(),
    getApprovedDonations(),
  ])
  const pct = Math.min((total / config.goal) * 100, 100)
  const pctLabel = pct < 1 ? '<1' : Math.round(pct).toString()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '64px 72px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
          }} />
          <div style={{ color: '#64748b', fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>
            FUNDRAISER
          </div>
        </div>

        {/* Main title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#94a3b8', fontSize: 24, fontWeight: 500, marginBottom: 10 }}>
            Help us lay
          </div>
          <div style={{
            color: '#f1f5f9',
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 10,
          }}>
            {config.deceasedName}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 24, fontWeight: 500 }}>
            to rest with dignity.
          </div>
        </div>

        {/* Bottom: bar + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Progress bar */}
          <div style={{
            display: 'flex',
            width: '100%',
            height: 10,
            backgroundColor: '#1e293b',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.max(pct, 0.5)}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: 99,
            }} />
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>

            {/* Left: amount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{
                color: '#f8fafc',
                fontSize: 56,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -1,
              }}>
                {`$${total.toLocaleString()}`}
              </div>
              <div style={{ color: '#475569', fontSize: 20 }}>
                {`raised of $${config.goal.toLocaleString()} goal · ${donors.length} donation${donors.length !== 1 ? 's' : ''}`}
              </div>
            </div>

            {/* Right: pct */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{
                color: '#60a5fa',
                fontSize: 56,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: -1,
              }}>
                {`${pctLabel}%`}
              </div>
              <div style={{ color: '#475569', fontSize: 20 }}>
                funded
              </div>
            </div>

          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
