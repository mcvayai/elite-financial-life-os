'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [coachResponse, setCoachResponse] = useState<any>(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserName(parsed.name || 'User');
    }
  }, []);
  
  const askCoach = async () => {
    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context: { userName } })
    });
    const data = await response.json();
    setCoachResponse(data);
  };
  
  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
      <p className="text-gray-600 mb-8">Here's your financial dashboard</p>
      
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
      
      <div className="p-6 border rounded-lg bg-blue-50">
        <h2 className="text-lg font-semibold mb-4">AI Coach</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Ask your AI coach..."
            className="flex-1 px-4 py-2 border rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            onClick={askCoach}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ask
          </button>
        </div>
        {coachResponse && (
          <div className="p-4 bg-white rounded">
            <p>{coachResponse.reply}</p>
          </div>
        )}
      </div>
    </main>
  );
}
