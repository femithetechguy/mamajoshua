'use client'

import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function DonateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-colors text-sm shadow-md shadow-blue-200"
      >
        I already donated — confirm here
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>

      <ConfirmModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
