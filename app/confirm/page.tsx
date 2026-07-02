'use client'

import { useState } from 'react'

export default function ConfirmPage() {
  const [form, setForm] = useState({ fullName: '', amount: '', anonymous: false })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
          anonymous: form.anonymous,
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-3xl">🙏</div>
        <h1 className="text-xl font-semibold text-gray-900">Thank you!</h1>
        <p className="text-sm text-gray-600">
          We&apos;ll add your donation once we&apos;ve verified it. The family is deeply grateful for your support.
        </p>
        <a href="/" className="inline-block mt-4 text-sm text-stone-700 underline underline-offset-4">
          ← Back to fundraiser
        </a>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div>
        <a href="/" className="text-sm text-stone-600 hover:text-stone-800">← Back</a>
        <h1 className="mt-3 text-xl font-semibold text-gray-900">Confirm your donation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Let us know you sent a donation so we can verify and add it to the fundraiser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
            placeholder="Maria Rodriguez"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount sent
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              required
              min={1}
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="100"
              className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Display preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How should we display your name?
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="display"
                checked={!form.anonymous}
                onChange={() => setForm(f => ({ ...f, anonymous: false }))}
                className="accent-stone-600"
              />
              Show my name
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="display"
                checked={form.anonymous}
                onChange={() => setForm(f => ({ ...f, anonymous: true }))}
                className="accent-stone-600"
              />
              Show as Anonymous
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Either way, the family will always see your real name and amount privately.
          </p>
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-stone-700 text-white rounded-md py-2.5 text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {status === 'loading' ? 'Submitting…' : 'Submit confirmation'}
        </button>
      </form>
    </main>
  )
}
