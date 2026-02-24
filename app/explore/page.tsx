'use client'

import { Compass, Play, Heart, Share2, Music, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const TRENDING = [
  { id: '1', title: 'Midnight Drive', artist: 'AI_Beats', genre: 'Lo-Fi', plays: '124K', likes: '8.2K', mood: 'Chill' },
  { id: '2', title: 'Dark Symphony', artist: 'Neural_Sound', genre: 'Trap', plays: '98K', likes: '6.5K', mood: 'Dark' },
  { id: '3', title: 'Summer Vibes', artist: 'WaveGen_AI', genre: 'Pop', plays: '201K', likes: '15K', mood: 'Happy' },
  { id: '4', title: 'Bass Drop 3000', artist: 'ElectroMind', genre: 'Electronic', plays: '87K', likes: '4.9K', mood: 'Energetic' },
  { id: '5', title: 'Soul Journey', artist: 'DeepThought', genre: 'R&B', plays: '156K', likes: '11K', mood: 'Romantic' },
  { id: '6', title: 'Neon Nights', artist: 'SynthWave_AI', genre: 'Synthwave', plays: '73K', likes: '3.8K', mood: 'Mysterious' },
]

const GENRE_COLORS: Record<string, string> = {
  'Lo-Fi': 'bg-blue-500/20 text-blue-400',
  'Trap': 'bg-gray-500/20 text-gray-400',
  'Pop': 'bg-pink-500/20 text-pink-400',
  'Electronic': 'bg-purple-500/20 text-purple-400',
  'R&B': 'bg-red-500/20 text-red-400',
  'Synthwave': 'bg-indigo-500/20 text-indigo-400',
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Compass className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Explore</h1>
            <p className="text-gray-400">Discover trending AI-generated tracks</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white mb-4">
          Trending Now
        </h2>

        <div className="space-y-3">
          {TRENDING.map((track, i) => (
            <div key={track.id} className="glass-card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <span className="text-gray-600 font-bold w-6 text-right text-sm">{i + 1}</span>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff87]/20 to-[#00ccff]/20 flex items-center justify-center flex-shrink-0">
                <Music className="w-5 h-5 text-[#00ff87]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{track.title}</p>
                <p className="text-gray-400 text-sm">{track.artist}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${GENRE_COLORS[track.genre] || 'bg-white/10 text-gray-300'}`}>
                {track.genre}
              </span>
              <div className="text-right">
                <p className="text-gray-300 text-sm">{track.plays}</p>
                <p className="text-gray-500 text-xs">plays</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Play className="w-4 h-4 text-[#00ff87]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Heart className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/music-generator"
            className="inline-flex items-center gap-2 bg-[#00ff87] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00cc6a] transition-colors"
          >
            <Music className="w-4 h-4" /> Create Your Own
          </Link>
        </div>
      </div>
    </main>
  )
}
