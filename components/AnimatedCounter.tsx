'use client'

import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 1600
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // easeOutQuart — starts fast, eases to a smooth stop
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value])

  return <>${display.toLocaleString()}</>
}
