'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Video, Loader2, ArrowLeft, Play } from 'lucide-react'
import Link from 'next/link'
import { generateVideo } from '@/lib/api-client'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

const STYLES = ['Cinematic', 'Animated', 'Neon/Cyberpunk', 'Nature', 'Abstract', 'Urban', 'Vintage', 'Futuristic']

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Cinematic')
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const { addVideo, deductCredits } = useAppStore()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your video')
      return
    }
    setLoading(true)
    try {
      const result = await generateVideo({ prompt, style, duration })
      setVideoUrl(result.videoUrl)
      addVideo({
        id: generateId(),
        title: prompt.slice(0, 50),
        prompt,
        videoUrl: result.videoUrl,
        thumbnailUrl: result.thumbnailUrl,
        duration,
        createdAt: new Date().toISOString(),
      })
      deductCredits(20)
      toast.success('Video generated!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Video className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Video Suite</h1>
            <p className="text-gray-400">AI music video generation via Replicate Kling</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Description *</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Artist performing on stage in a dark concert hall with dramatic lighting and fog effects..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 resize-none h-24 focus:outline-none focus:border-[#00ff87] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration: {duration}s</label>
              <input
                type="range" min={3} max={10} value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full mt-3 accent-[#00ff87]"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#00ff87] hover:bg-[#00cc6a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating Video...</>
            ) : (
              <><Video className="w-5 h-5" /> Generate Video (20 credits)</>
            )}
          </button>
        </div>

        {videoUrl && (
          <div className="glass-card p-6 mt-6">
            <h3 className="text-white font-semibold mb-4">Generated Video</h3>
            <video src={videoUrl} controls className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </main>
  )
}
