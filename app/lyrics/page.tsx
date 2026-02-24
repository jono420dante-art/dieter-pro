'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FileText, Copy, Download, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { generateLyrics } from '@/lib/api-client'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

const GENRES = ['Hip-Hop', 'R&B', 'Pop', 'Rock', 'Country', 'Jazz', 'Electronic', 'Gospel', 'Soul', 'Reggae']
const MOODS = ['Uplifting', 'Dark', 'Romantic', 'Angry', 'Nostalgic', 'Hopeful', 'Melancholic', 'Playful']
const STYLES = ['Storytelling', 'Battle rap', 'Conscious', 'Party', 'Love song', 'Protest', 'Motivational']

export default function LyricsPage() {
  const [genre, setGenre] = useState('Hip-Hop')
  const [mood, setMood] = useState('Uplifting')
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('Storytelling')
  const [loading, setLoading] = useState(false)
  const [lyrics, setLyrics] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const { addLyric, deductCredits } = useAppStore()

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for your lyrics')
      return
    }
    setLoading(true)
    try {
      const result = await generateLyrics({ genre, mood, topic, style })
      setLyrics(result.lyrics)
      setTitle(result.title)
      addLyric({
        id: generateId(),
        title: result.title,
        genre, mood,
        content: result.lyrics,
        createdAt: new Date().toISOString(),
      })
      deductCredits(5)
      toast.success('Lyrics generated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyLyrics = () => {
    if (lyrics) {
      navigator.clipboard.writeText(lyrics)
      toast.success('Lyrics copied to clipboard!')
    }
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lyrics AI</h1>
            <p className="text-gray-400">GPT-4o powered songwriting</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic / Theme *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Coming up from nothing, hustle, love lost..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff87] transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00ff87]"
              >
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#00ff87] hover:bg-[#00cc6a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Writing Lyrics...</>
            ) : (
              <><FileText className="w-5 h-5" /> Generate Lyrics (5 credits)</>
            )}
          </button>
        </div>

        {lyrics && (
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{title}</h3>
              <div className="flex gap-2">
                <button onClick={copyLyrics} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">{lyrics}</pre>
          </div>
        )}
      </div>
    </main>
  )
}
