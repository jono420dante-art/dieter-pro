'use client'

import Link from 'next/link'
import { Music, Video, FileText, Scissors, Sliders, Compass, Library, Clock, Zap } from 'lucide-react'

const features = [
  { href: '/music-generator', icon: Music, label: 'Music Generator', desc: 'Create AI tracks with MusicGen', color: 'from-green-500/20 to-green-600/10' },
  { href: '/lyrics', icon: FileText, label: 'Lyrics AI', desc: 'GPT-4o powered songwriting', color: 'from-blue-500/20 to-blue-600/10' },
  { href: '/video-generator', icon: Video, label: 'Video Suite', desc: 'AI music video generation', color: 'from-purple-500/20 to-purple-600/10' },
  { href: '/stem-splitter', icon: Scissors, label: 'Stem Splitter', desc: 'Separate vocals, drums, bass', color: 'from-orange-500/20 to-orange-600/10' },
  { href: '/mixer', icon: Sliders, label: 'Mixer Pro', desc: 'Multi-track waveform mixer', color: 'from-red-500/20 to-red-600/10' },
  { href: '/create', icon: Zap, label: 'Quick Create', desc: 'Rapid AI track generation', color: 'from-yellow-500/20 to-yellow-600/10' },
  { href: '/explore', icon: Compass, label: 'Explore', desc: 'Discover trending tracks', color: 'from-teal-500/20 to-teal-600/10' },
  { href: '/library', icon: Library, label: 'Library', desc: 'Your saved creations', color: 'from-indigo-500/20 to-indigo-600/10' },
  { href: '/history', icon: Clock, label: 'History', desc: 'Generation history log', color: 'from-pink-500/20 to-pink-600/10' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">DIETER PRO</h1>
          <p className="text-xl text-gray-400">Your AI-powered music creation studio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`glass-card p-6 bg-gradient-to-br ${f.color} hover:scale-105 transition-all duration-200 hover:glow-green group`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#00ff87]/20 transition-colors">
                  <f.icon className="w-6 h-6 text-[#00ff87]" />
                </div>
                <h2 className="text-lg font-semibold text-white">{f.label}</h2>
              </div>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
