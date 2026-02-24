import Link from 'next/link'
import { Home, Music } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#00ff87]/10 flex items-center justify-center mx-auto mb-6">
          <Music className="w-10 h-10 text-[#00ff87]" />
        </div>
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          This track doesn&apos;t exist yet. Let&apos;s create something new.
        </p>
        <Link
          href="/music-generator"
          className="inline-flex items-center gap-2 bg-[#00ff87] hover:bg-[#00cc6a] text-black font-bold px-6 py-3 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" />
          Go to Music Studio
        </Link>
      </div>
    </div>
  )
}
