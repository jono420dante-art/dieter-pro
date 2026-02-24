'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Zap, Music, Loader2, ArrowLeft, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import { generateMusic } from '@/lib/api-client'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'
import { useRef } from 'react'

const QUICK_PROMPTS = [
  'Hard trap beat with 808s and dark melody',
  'Chill lo-fi hip hop with jazz samples',
  'Upbeat pop song with catchy chorus',
  'Deep house groove with synth bass',
  'Emotional R&B ballad with piano',
  'Aggressive drill beat with heavy bass',
]

export default function CreatePage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { addTrack, deductCredits } = useAppStore()

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt
    if (!finalPrompt.trim()) {
      toast.error('Enter a prompt or pick a quick start')
      return
    }
    setLoading(true)
    try {
      const result = await generateMusic({
        prompt: finalPrompt,
        genre: 'Hip-Hop',
        mood: 'Energetic',
        bpm: 140,
        duration: 15,
        voiceModel: 'No Vocals',
      })
      setAudioUrl(result.audioUrl)
      addTrack({
        id: generateId(),
        title: result.title,
        genre: 'Hip-Hop',
        mood: 'Energetic',
        bpm: 140,
        duration: 15,
        voiceModel: 'No Vocals',
        audioUrl: result.audioUrl,
        createdAt: new Date().toISOString(),
      })
      deductCredits(10)
      toast.success('Track created!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause() } else { audioRef.current.play() }
    setPlaying(!playing)
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quick Create</h1>
          <p className="text-gray-400">Rapid AI track generation</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Describe your track</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Dark trap beat with 808s and piano..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff87] transition-colors"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="bg-[#00ff87] hover:bg-[#00cc6a] disabled:opacity-50 text-black font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Quick starts:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPrompt(p); handleGenerate(p) }}
                  disabled={loading}
                  className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00ff87]/50 text-gray-300 text-sm transition-all disabled:opacity-50"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {audioUrl && (
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-4">
              <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#00ff87] flex items-center justify-center hover:bg-[#00cc6a] transition-colors"
              >
                {playing ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black ml-1" />}
              </button>
              <div>
                <p className="text-white font-semibold">Track Generated!</p>
                <p className="text-gray-400 text-sm">Click play to listen</p>
              </div>
              <Link href="/mixer" className="ml-auto text-[#00ff87] text-sm hover:underline">
                Open in Mixer
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
