export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-gray-900">
          Elite Financial Life OS
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your AI-powered financial coach combining personality-based guidance,
          biblical stewardship, and complete customization.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}
