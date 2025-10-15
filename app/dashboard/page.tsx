'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  income: number; // monthly income
}

interface BudgetCategory {
  id: string;
  name: string;
  planned: number; // planned monthly budget
  spent: number; // amount spent this month
}

export default function Dashboard() {
  // Profile
  const [profile, setProfile] = useState<UserProfile>({ name: 'User', income: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Biblical mode
  const [biblicalMode, setBiblicalMode] = useState<boolean>(false);

  // Budgets
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPlanned, setNewCatPlanned] = useState('');

  // Coach
  const [message, setMessage] = useState('');
  const [coachReply, setCoachReply] = useState<string>('');
  const [coachError, setCoachError] = useState<string>('');
  const [coachLoading, setCoachLoading] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setProfile({
          name: parsed.name || 'User',
          income: Number(parsed.income) || 0,
        });
      }

      const savedBiblicalMode = localStorage.getItem('biblicalMode');
      if (savedBiblicalMode !== null) {
        setBiblicalMode(JSON.parse(savedBiblicalMode));
      }

      const savedBudgets = localStorage.getItem('budgets');
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      } else {
        // Seed with a few example categories
        const seed: BudgetCategory[] = [
          { id: 'housing', name: 'Housing', planned: 1500, spent: 0 },
          { id: 'food', name: 'Food', planned: 500, spent: 0 },
          { id: 'giving', name: 'Giving', planned: 500, spent: 0 },
        ];
        setBudgets(seed);
        localStorage.setItem('budgets', JSON.stringify(seed));
      }
    } catch (e) {
      console.error('Failed to load local settings', e);
    } finally {
      setIsLoaded(true);
    }

    // Live update biblical mode from Settings via custom event
    const onBiblicalModeChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.biblicalMode === 'boolean') {
        setBiblicalMode(detail.biblicalMode);
      }
    };
    window.addEventListener('biblicalModeChanged', onBiblicalModeChanged as EventListener);
    return () => window.removeEventListener('biblicalModeChanged', onBiblicalModeChanged as EventListener);
  }, []);

  // Persist budgets when they change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to save budgets', e);
    }
  }, [budgets, isLoaded]);

  // Persist profile on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('userData', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile, isLoaded]);

  // Computed totals
  const totals = useMemo(() => {
    const planned = budgets.reduce((sum, b) => sum + (Number(b.planned) || 0), 0);
    const spent = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);
    const remaining = Math.max(planned - spent, 0);
    return { planned, spent, remaining };
  }, [budgets]);

  // Budget actions
  const addCategory = () => {
    const name = newCatName.trim();
    const planned = Number(newCatPlanned);
    if (!name || isNaN(planned) || planned < 0) return;
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setBudgets(prev => [...prev, { id, name, planned, spent: 0 }]);
    setNewCatName('');
    setNewCatPlanned('');
  };

  const removeCategory = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const updatePlanned = (id: string, planned: number) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, planned: Math.max(planned, 0) } : b)));
  };

  const updateSpent = (id: string, spent: number) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, spent: Math.max(spent, 0) } : b)));
  };

  // Coach ask
  const askCoach = async () => {
    if (!message.trim()) return;
    setCoachError('');
    setCoachReply('');
    setCoachLoading(true);
    try {
      const context = {
        user: { name: profile.name, income: profile.income },
        budgets: budgets.map(({ name, planned, spent }) => ({ name, planned, spent })),
        summary: `Income ${profile.income}, planned ${totals.planned}, spent ${totals.spent}`,
      };
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, biblicalMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to get response');
      setCoachReply(data.reply || '');
    } catch (e: any) {
      setCoachError(e.message || 'Something went wrong.');
    } finally {
      setCoachLoading(false);
    }
  };

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
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.name}!</h1>
            <p className="text-gray-600">Your Elite Financial Life OS dashboard</p>
          </div>
          <Link href="/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow text-indigo-700 hover:bg-indigo-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756.426-1.756 2.924 0 3.35a1.724 1.724 0 001.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572z" />
            </svg>
            Settings
          </Link>
        </div>

        {/* Summary cards */}
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

        {/* Profile card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
