'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ConfirmModal({ isOpen, onClose }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: '', amount: '', contact: '', anonymous: false })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/donations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          amount: Number(form.amount),
          contact: form.contact,
          anonymous: form.anonymous,
        }),
      })
      if (res.ok) {
        setStatus('success')
        router.refresh() // re-fetch server component data so totals update instantly
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  function handleClose() {
    onClose()
    // reset after animation
    setTimeout(() => {
      setForm({ fullName: '', amount: '', contact: '', anonymous: false })
      setStatus('idle')
    }, 200)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Scrollable overlay — lets modal shrink when keyboard opens */}
      <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
        <div className="flex min-h-full items-center justify-center p-4">

      {/* Sheet / Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Confirm your donation</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              We&apos;ll verify and add it to the fundraiser.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-1">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Thank you!</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We&apos;ll add your donation once we&apos;ve verified it. The family is deeply grateful for your support.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Full name
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder="Maria Rodriguez"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Amount sent
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="100"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Phone or email <span className="text-gray-400 normal-case font-normal tracking-normal">— optional</span>
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                placeholder="For verification only"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              />
            </div>

            {/* Display preference */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Display name as
              </label>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                  !form.anonymous ? 'border-blue-400 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="display"
                    className="hidden"
                    checked={!form.anonymous}
                    onChange={() => setForm(f => ({ ...f, anonymous: false }))}
                  />
                  My name
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${
                  form.anonymous ? 'border-blue-400 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="display"
                    className="hidden"
                    checked={form.anonymous}
                    onChange={() => setForm(f => ({ ...f, anonymous: true }))}
                  />
                  Anonymous
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                The family will always see your real name privately.
              </p>
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl py-3 text-sm font-bold disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Submitting…' : 'Submit confirmation'}
            </button>

          </form>
        )}
      </div>

        </div>
      </div>
    </>
  )
}
