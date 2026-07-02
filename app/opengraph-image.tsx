import { ImageResponse } from 'next/og'
import { getSiteConfig } from '@/lib/config'
import { getTotalRaised, getApprovedDonations } from '@/lib/donations'

export const alt = 'Fundraiser — Help Us Lay Mrs Rose Joshua to Rest'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const config = getSiteConfig()
  const total = getTotalRaised()
  const donors = getApprovedDonations()
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
          backgroundColor: '#0f172a',
          padding: '64px 72px',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle top-right glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Header row: candle + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div
            style={{
              width: 52,
              height: 52,
              backgroundColor: '#1e293b',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            🕯️
          </div>
          <span
            style={{
              color: '#64748b',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            FUNDRAISER
          </span>
        </div>

        {/* Main title */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              color: '#94a3b8',
              fontSize: 22,
              fontWeight: 500,
              marginBottom: 12,
            }}
          >
            Help us lay
          </div>
          <div
            style={{
              color: '#f1f5f9',
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 10,
            }}
          >
            {config.deceasedName}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            to rest with dignity.
          </div>
        </div>

        {/* Bottom: progress bar + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Progress track */}
          <div
            style={{
              width: '100%',
              height: 10,
              backgroundColor: '#1e293b',
              borderRadius: 99,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                minWidth: pct > 0 ? 16 : 0,
                height: '100%',
                backgroundColor: '#3b82f6',
                borderRadius: 99,
              }}
            />
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            {/* Left: amount */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  color: '#f8fafc',
                  fontSize: 52,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                ${total.toLocaleString()}
              </div>
              <div style={{ color: '#475569', fontSize: 18 }}>
                raised of ${config.goal.toLocaleString()} goal
              </div>
            </div>

            {/* Right: pct + donors */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
              }}
            >
              <div
                style={{
                  color: '#60a5fa',
                  fontSize: 52,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                {pctLabel}%
              </div>
              <div style={{ color: '#475569', fontSize: 18 }}>
                {donors.length} donation{donors.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
