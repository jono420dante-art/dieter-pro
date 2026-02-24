'use client'

import { useState } from 'react'
import { Clock, Music, Video, FileText, Trash2, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

type HistoryFilter = 'all' | 'tracks' | 'videos' | 'lyrics'

export default function HistoryPage() {
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const { tracks, videos, lyrics, removeTrack, removeVideo, removeLyric } = useAppStore()

  const handleDeleteTrack = (id: string) => {
    removeTrack(id)
    toast.success('Track removed from history')
  }

  const handleDeleteVideo = (id: string) => {
    removeVideo(id)
    toast.success('Video removed from history')
  }

  const handleDeleteLyric = (id: string) => {
    removeLyric(id)
    toast.success('Lyric removed from history')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const allItems = [
    ...tracks.map(t => ({ ...t, type: 'track' as const })),
    ...videos.map(v => ({ ...v, type: 'video' as const })),
    ...lyrics.map(l => ({ ...l, type: 'lyric' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredItems = allItems.filter(item => {
    if (filter === 'all') return true
    if (filter === 'tracks') return item.type === 'track'
    if (filter === 'videos') return item.type === 'video'
    if (filter === 'lyrics') return item.type === 'lyric'
    return true
  })

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Generation History</h1>
            <p className="text-gray-400">Your complete AI generation log</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'tracks', 'videos', 'lyrics'] as HistoryFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-[#00ff87] text-black'
                  : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No history yet. Start generating!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="glass-card p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.type === 'track' ? 'bg-green-500/20' :
                  item.type === 'video' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                }`}>
                  {item.type === 'track' && <Music className="w-5 h-5 text-green-400" />}
                  {item.type === 'video' && <Video className="w-5 h-5 text-purple-400" />}
                  {item.type === 'lyric' && <FileText className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  <p className="text-gray-400 text-sm">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} &bull; {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {'audioUrl' in item && (
                    <a
                      href={item.audioUrl}
                      download
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (item.type === 'track') handleDeleteTrack(item.id)
                      else if (item.type === 'video') handleDeleteVideo(item.id)
                      else handleDeleteLyric(item.id)
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
