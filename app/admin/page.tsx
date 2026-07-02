'use client'

import { useState, useEffect, useCallback } from 'react'
import { Donation } from '@/types'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDonations = useCallback(async (pw: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/donations', {
        headers: { 'x-admin-password': pw },
      })
      if (res.status === 401) { setError('Wrong password'); setAuthed(false); return }
      const data = await res.json()
      setDonations(data)
      setAuthed(true)
    } catch {
      setError('Failed to fetch donations')
    } finally {
      setLoading(false)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    await fetchDonations(password)
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    await fetch(`/api/admin/donations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ status }),
    })
    await fetchDonations(password)
  }

  const pending = donations.filter(d => d.status === 'pending')
  const approved = donations.filter(d => d.status === 'approved')
  const rejected = donations.filter(d => d.status === 'rejected')
  const totalApproved = approved.reduce((s, d) => s + d.amount, 0)

  if (!authed) {
    return (
      <main className="max-w-sm mx-auto px-4 py-16 space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-700 text-white rounded-md py-2 text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Log in'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">
          Total approved: <span className="font-semibold text-gray-800">${totalApproved.toLocaleString()}</span>
        </span>
      </div>

      {/* Pending */}
      <Section title={`Pending (${pending.length})`}>
        {pending.length === 0
          ? <p className="text-sm text-gray-400">No pending donations.</p>
          : pending.map(d => (
              <DonationRow key={d.id} d={d} onApprove={() => updateStatus(d.id, 'approved')} onReject={() => updateStatus(d.id, 'rejected')} />
            ))
        }
      </Section>

      {/* Approved */}
      <Section title={`Approved (${approved.length})`}>
        {approved.length === 0
          ? <p className="text-sm text-gray-400">None yet.</p>
          : approved.map(d => (
              <DonationRow key={d.id} d={d} onReject={() => updateStatus(d.id, 'rejected')} />
            ))
        }
      </Section>

      {/* Rejected */}
      {rejected.length > 0 && (
        <Section title={`Rejected (${rejected.length})`}>
          {rejected.map(d => (
            <DonationRow key={d.id} d={d} onApprove={() => updateStatus(d.id, 'approved')} />
          ))}
        </Section>
      )}
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  )
}

function DonationRow({
  d,
  onApprove,
  onReject,
}: {
  d: Donation
  onApprove?: () => void
  onReject?: () => void
}) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{d.fullName}</p>
        <p className="text-xs text-gray-400">
          {d.anonymous ? 'Shows as Anonymous' : `Shows as ${d.displayName}`} ·{' '}
          {new Date(d.submittedAt).toLocaleDateString()}
        </p>
      </div>
      <span className="text-sm font-semibold text-gray-700 shrink-0">${d.amount.toLocaleString()}</span>
      <div className="flex gap-2 shrink-0">
        {onApprove && (
          <button
            onClick={onApprove}
            className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded hover:bg-green-200"
          >
            Approve
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            className="text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded hover:bg-red-200"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  )
}
