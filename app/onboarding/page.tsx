'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', goal: '' });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(formData));
    router.push('/dashboard');
  };
  
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-6">Get Started</h1>
        
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <textarea
          placeholder="Your Financial Goal"
          className="w-full px-4 py-2 border rounded"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          required
        />
        
        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
