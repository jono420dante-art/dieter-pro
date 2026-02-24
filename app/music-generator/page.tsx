'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Music, Play, Pause, Download, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { generateMusic } from '@/lib/api-client'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

const GENRES = ['Hip-Hop', 'Electronic', 'Pop', 'R&B', 'Jazz', 'Rock', 'Classical', 'Ambient', 'Trap', 'Lo-Fi']
const MOODS = ['Energetic', 'Chill', 'Dark', 'Happy', 'Melancholic', 'Aggressive', 'Romantic', 'Mysterious']
const VOICE_MODELS = ['No Vocals', 'Male Rap', 'Female Vocals', 'Male Vocals', 'Choir']

export default function MusicGeneratorPage() {
  const [genre, setGenre] = useState('Hip-Hop')
  const [mood, setMood] = useState('Energetic')
  const [bpm, setBpm] = useState(120)
  const [duration, setDuration] = useState(15)
  const [voiceModel, setVoiceModel] = useState('No Vocals')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { addTrack, deductCredits } = useAppStore()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your track')
      return
    }
    setLoading(true)
    try {
      const result = await generateMusic({ prompt, genre, mood, bpm, duration, voiceModel })
      setAudioUrl(result.audioUrl)
      addTrack({
        id: generateId(),
        title: result.title,
        genre, mood, bpm, duration, voiceModel,
        audioUrl: result.audioUrl,
        createdAt: new Date().toISOString(),
      })
      deductCredits(10)
      toast.success('Track generated successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Music className="w-6 h-6 text-[#00ff87]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Music Generator</h1>
            <p className="text-gray-400">Create AI tracks with Replicate MusicGen</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Describe your track *</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Hard-hitting trap beat with 808 bass, hi-hats and dark piano melody..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-[#00ff87] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00ff87]"
              >
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00ff87]"
              >
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">BPM: {bpm}</label>
              <input
                type="range" min={60} max={200} value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration: {duration}s</label>
              <input
                type="range" min={5} max={30} value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-[#00ff87]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Voice Model</label>
              <select
                value={voiceModel}
                onChange={(e) => setVoiceModel(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#00ff87]"
              >
                {VOICE_MODELS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#00ff87] hover:bg-[#00cc6a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating Track...</>
            ) : (
              <><Music className="w-5 h-5" /> Generate Track (10 credits)</>
            )}
          </button>
        </div>

        {audioUrl && (
          <div className="glass-card p-6 mt-6">
            <h3 className="text-white font-semibold mb-4">Generated Track</h3>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[#00ff87] flex items-center justify-center hover:bg-[#00cc6a] transition-colors"
              >
                {playing ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
              </button>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#00ff87] rounded-full" style={{ width: playing ? '45%' : '0%', transition: 'width 0.5s' }} />
              </div>
              <a
                href={audioUrl}
                download="track.mp3"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Download className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
