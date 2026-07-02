'use client'

import { useState } from 'react'

export default function ShareButtons({ message }: { message: string }) {
  const [copied, setCopied] = useState(false)

  function shareWhatsApp() {
    const url = window.location.href
    const text = encodeURIComponent(`${message} ${url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }

  function shareMessages() {
    const url = window.location.href
    const text = encodeURIComponent(`${message} ${url}`)
    window.open(`sms:?body=${text}`, '_self')
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-sm font-bold text-gray-900 mb-0.5">Help spread the word</p>
      <p className="text-xs text-gray-400 mb-4">Each share brings more support to the family.</p>

      <div className="flex gap-3">

        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          title="Share on WhatsApp"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 0.1s both' }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#18a84f] text-white transition-all hover:scale-110 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.81L2 22l5.42-1.36c1.38.75 2.96 1.18 4.62 1.18 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.52 13.83c-.23.65-1.33 1.24-1.82 1.32-.49.09-1.1.12-1.77-.11-.41-.14-.93-.32-1.6-.63-2.82-1.22-4.66-4.07-4.8-4.26-.14-.19-1.13-1.5-1.13-2.87s.72-2.03.97-2.31c.25-.27.55-.34.73-.34l.52.01c.17 0 .39-.06.61.47.23.54.77 1.88.84 2.02.07.13.11.29.02.47-.09.17-.13.28-.26.43l-.39.45c-.13.13-.27.28-.12.54.16.27.69 1.14 1.48 1.84.02.02.05.04.07.07.83.74 1.62 1 1.9 1.11.28.11.45.09.61-.05.17-.15.7-.82.89-1.1.19-.28.38-.23.64-.14.27.09 1.7.8 1.99.94.29.14.48.21.55.33.07.12.07.69-.16 1.35z"/>
          </svg>
        </button>

        {/* Messages */}
        <button
          onClick={shareMessages}
          title="Share via Messages"
          style={{ animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 0.2s both' }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#34C759] hover:bg-[#2db84e] active:bg-[#28a546] text-white transition-all hover:scale-110 active:scale-95"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          title={copied ? 'Copied!' : 'Copy link'}
          style={{ animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275) 0.3s both' }}
          className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-95 ${
            copied
              ? 'bg-green-50 border-green-200 text-green-600'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          )}
        </button>

      </div>
    </div>
  )
}
