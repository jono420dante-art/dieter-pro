'use client'

import { useState, useRef } from 'react'
import { Sliders, Play, Pause, Square, Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

export default function MixerPage() {
  const { tracks } = useAppStore()
  const [playing, setPlaying] = useState<string | null>(null)
  const [volumes, setVolumes] = useState<Record<string, number>>({})
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  const getVolume = (id: string) => volumes[id] ?? 80

  const togglePlay = (track: { id: string; audioUrl: string }) => {
    if (playing === track.id) {
      audioRefs.current[track.id]?.pause()
      setPlaying(null)
    } else {
      if (playing && audioRefs.current[playing]) {
        audioRefs.current[playing].pause()
      }
      if (!audioRefs.current[track.id]) {
        audioRefs.current[track.id] = new Audio(track.audioUrl)
        audioRefs.current[track.id].onended = () => setPlaying(null)
      }
      audioRefs.current[track.id].volume = getVolume(track.id) / 100
      audioRefs.current[track.id].play()
      setPlaying(track.id)
    }
  }

  const setVolume = (id: string, vol: number) => {
    setVolumes(v => ({ ...v, [id]: vol }))
    if (audioRefs.current[id]) {
      audioRefs.current[id].volume = vol / 100
    }
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Sliders className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Mixer Pro</h1>
            <p className="text-gray-400">Multi-track player with volume controls</p>
          </div>
        </div>

        {tracks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Sliders className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No tracks yet</h3>
            <p className="text-gray-400 mb-6">Generate tracks in the Music Generator to mix them here</p>
            <Link href="/music-generator" className="bg-[#00ff87] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00cc6a] transition-colors">
              Go to Music Generator
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="glass-card p-4 flex items-center gap-6">
                <button
                  onClick={() => togglePlay(track)}
                  className="w-12 h-12 rounded-full bg-[#00ff87] flex items-center justify-center hover:bg-[#00cc6a] transition-colors flex-shrink-0"
                >
                  {playing === track.id
                    ? <Pause className="w-5 h-5 text-black" />
                    : <Play className="w-5 h-5 text-black ml-0.5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-gray-400 text-sm">{track.genre} · {track.mood} · {track.bpm} BPM</p>
                  {playing === track.id && (
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="wave-bar w-1 bg-[#00ff87] rounded-full"
                          style={{ height: `${Math.random() * 20 + 8}px`, animationDelay: `${i * 0.05}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-gray-400 text-xs">{getVolume(track.id)}%</span>
                  <input
                    type="range" min={0} max={100}
                    value={getVolume(track.id)}
                    onChange={(e) => setVolume(track.id, Number(e.target.value))}
                    className="w-24 accent-[#00ff87]"
                  />
                  <a
                    href={track.audioUrl}
                    download={`${track.title}.mp3`}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
