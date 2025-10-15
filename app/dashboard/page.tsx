'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [coachResponse, setCoachResponse] = useState<any>(null);

  useEffect(() => {
    fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Help me with my budget' })
    })
      .then(res => res.json())
      .then(data => setCoachResponse(data));
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Monthly Income</h2>
          <p className="text-2xl">$5,000</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Monthly Expenses</h2>
          <p className="text-2xl">$3,500</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Savings</h2>
          <p className="text-2xl">$1,500</p>
        </div>
      </div>

      {coachResponse && (
        <div className="p-6 border rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">AI Coach</h2>
          <p>{coachResponse.advice}</p>
        </div>
      )}
    </main>
  );
}
