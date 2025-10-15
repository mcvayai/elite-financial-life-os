'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type UserProfile = { name: string; income: number }
type BudgetCategory = { id: string; name: string; planned: number; spent: number }

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile>({ name: 'User', income: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [biblicalMode, setBiblicalMode] = useState(false)
  const [budgets, setBudgets] = useState<BudgetCategory[]>([])
  const [newCatName, setNewCatName] = useState('')
  const [newCatPlanned, setNewCatPlanned] = useState('')

  const [message, setMessage] = useState('')
  const [coachReply, setCoachReply] = useState('')
  const [coachError, setCoachError] = useState('')
  const [coachLoading, setCoachLoading] = useState(false)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userData')
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        setProfile({ name: parsed.name || 'User', income: Number(parsed.income) || 0 })
      }
      const savedBiblical = localStorage.getItem('biblicalMode')
      if (savedBiblical !== null) setBiblicalMode(JSON.parse(savedBiblical))
      const savedBudgets = localStorage.getItem('budgets')
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets))
      } else {
        const seed: BudgetCategory[] = [
          { id: 'housing', name: 'Housing', planned: 1500, spent: 0 },
          { id: 'food', name: 'Food', planned: 500, spent: 0 },
          { id: 'giving', name: 'Giving', planned: 500, spent: 0 },
        ]
        setBudgets(seed)
        localStorage.setItem('budgets', JSON.stringify(seed))
      }
    } finally {
      setIsLoaded(true)
    }
    const onBiblical = (e: Event) => {
      const d = (e as CustomEvent).detail
      if (d && typeof d.biblicalMode === 'boolean') setBiblicalMode(d.biblicalMode)
    }
    window.addEventListener('biblicalModeChanged', onBiblical as EventListener)
    return () => window.removeEventListener('biblicalModeChanged', onBiblical as EventListener)
  }, [])

  useEffect(() => { if (isLoaded) localStorage.setItem('budgets', JSON.stringify(budgets)) }, [budgets, isLoaded])
  useEffect(() => { if (isLoaded) localStorage.setItem('userData', JSON.stringify(profile)) }, [profile, isLoaded])

  const totals = useMemo(() => {
    const planned = budgets.reduce((s, b) => s + (Number(b.planned) || 0), 0)
    const spent = budgets.reduce((s, b) => s + (Number(b.spent) || 0), 0)
    return { planned, spent, remaining: Math.max(planned - spent, 0) }
  }, [budgets])

  const addCategory = () => {
    const name = newCatName.trim(); const planned = Number(newCatPlanned)
    if (!name || isNaN(planned) || planned < 0) return
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    setBudgets(p => [...p, { id, name, planned, spent: 0 }])
    setNewCatName(''); setNewCatPlanned('')
  }
  const removeCategory = (id: string) => setBudgets(p => p.filter(b => b.id !== id))
  const updatePlanned = (id: string, planned: number) => setBudgets(p => p.map(b => b.id === id ? { ...b, planned: Math.max(planned, 0) } : b))
  const updateSpent = (id: string, spent: number) => setBudgets(p => p.map(b => b.id === id ? { ...b, spent: Math.max(spent, 0) } : b))

  const askCoach = async () => {
    if (!message.trim()) return
    setCoachError(''); setCoachReply(''); setCoachLoading(true)
    try {
      const context = {
        user: { name: profile.name, income: profile.income },
        budgets: budgets.map(({ name, planned, spent }) => ({ name, planned, spent })),
        summary: `Income ${profile.income}, planned ${totals.planned}, spent ${totals.spent}`,
      }
      const res = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, biblicalMode })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to get response')
      setCoachReply((data.reply || '').trim())
    } catch (e: any) {
      setCoachError(e.message || 'Something went wrong.')
    } finally {
      setCoachLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-white rounded-xl shadow" />
            <div className="h-32 bg-white rounded-xl shadow" />
            <div className="h-32 bg-white rounded-xl shadow" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.name}!</h1>
            <p className="text-gray-600">Your Elite Financial Life OS dashboard</p>
          </div>
          <Link href="/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow text-indigo-700 hover:bg-indigo-50">Settings</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-gray-600">Monthly Income</h3>
            <p className="text-2xl font-semibold text-gray-900">${profile.income.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-gray-600">Planned Spending</h3>
            <p className="text-2xl font-semibold text-gray-900">${totals.planned.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-gray-600">Spent This Month</h3>
            <p className="text-2xl font-semibold text-gray-900">${totals.spent.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Monthly Income</label>
              <input type="number" min={0} value={profile.income} onChange={e => setProfile(p => ({ ...p, income: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex items-end">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <span className="text-sm font-medium">Biblical Mode:</span>
                <span className="text-sm font-semibold">{biblicalMode ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Profile is stored locally in your browser (no sign-in required).</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Budget Categories</h2>
            <div className="text-sm text-gray-600">Remaining: <span className="font-semibold text-gray-900">${(totals.planned - totals.spent).toLocaleString()}</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {budgets.map(b => {
              const pct = b.planned > 0 ? Math.min((b.spent / b.planned) * 100, 100) : 0
              const bar = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              return (
                <div key={b.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{b.name}</h3>
                    <button onClick={() => removeCategory(b.id)} className="text-gray-400 hover:text-red-600" aria-label={`Remove ${b.name}`}>✕</button>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div className={`${bar} h-2`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Spent: ${b.spent.toLocaleString()}</span>
                    <span>Planned: ${b.planned.toLocaleString()}</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Planned</label>
                      <input type="number" min={0} value={b.planned} onChange={e => updatePlanned(b.id, Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Spent</label>
                      <input type="number" min={0} value={b.spent} onChange={e => updateSpent(b.id, Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Category name" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <input type="number" min={0} placeholder="Planned $/mo" value={newCatPlanned} onChange={e => setNewCatPlanned(e.target.value)} className="px-3 py-2 border rounded-lg" />
            <button onClick={addCategory} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Add Category</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">AI Coach</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" placeholder="Ask your AI coach..." value={message} onChange={e => setMessage(e.target.value)} className="flex-1 px-4 py-2 border rounded" />
            <button onClick={askCoach} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={coachLoading}>{coachLoading ? 'Thinking…' : 'Ask'}</button>
          </div>
          {coachError && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{coachError}</div>}
          {coachReply && <div className="p-4 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">{coachReply}</div>}
          {biblicalMode && <p className="text-xs text-indigo-700 mt-2">Biblical mode is ON. Responses may include scripture-based principles.</p>}
        </div>
      </div>
    </main>
  )
}
