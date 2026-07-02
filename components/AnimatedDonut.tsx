'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedDonut({ pct }: { pct: number }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const target = (pct / 100) * circ
    const duration = 1400
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      if (circleRef.current) {
        circleRef.current.setAttribute('stroke-dasharray', `${current} ${circ}`)
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [pct, circ])

  const label = pct < 1 ? '<1%' : `${Math.round(pct)}%`

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
        {/* Track */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        {/* Animated fill */}
        <circle
          ref={circleRef}
          cx="50" cy="50" r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeDasharray={`0 ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-gray-800">{label}</span>
      </div>
    </div>
  )
}
