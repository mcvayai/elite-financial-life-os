import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Elite Financial Life OS</h1>
      <div className="flex gap-4">
        <Link href="/onboarding" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Get Started
        </Link>
        <Link href="/dashboard" className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
