'use client'

import { Library, Music, FileText, Video, Trash2, ArrowLeft, Play } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { useState } from 'react'

type Tab = 'tracks' | 'lyrics' | 'videos'

export default function LibraryPage() {
  const { tracks, lyrics, videos, removeTrack, removeLyric, removeVideo } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('tracks')

  const tabs = [
    { id: 'tracks' as Tab, label: 'Tracks', icon: Music, count: tracks.length },
    { id: 'lyrics' as Tab, label: 'Lyrics', icon: FileText, count: lyrics.length },
    { id: 'videos' as Tab, label: 'Videos', icon: Video, count: videos.length },
  ]

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Library className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Library</h1>
            <p className="text-gray-400">Your saved creations</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00ff87] text-black'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-black/20' : 'bg-white/10'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {activeTab === 'tracks' && (
          <div className="space-y-3">
            {tracks.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No tracks yet. <Link href="/music-generator" className="text-[#00ff87] hover:underline">Generate one</Link></p>
              </div>
            ) : tracks.map((track) => (
              <div key={track.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-[#00ff87]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-gray-400 text-sm">{track.genre} · {track.mood} · {track.bpm} BPM</p>
                </div>
                <audio src={track.audioUrl} controls className="h-8 w-48" />
                <button onClick={() => removeTrack(track.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lyrics' && (
          <div className="space-y-3">
            {lyrics.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No lyrics yet. <Link href="/lyrics" className="text-[#00ff87] hover:underline">Generate some</Link></p>
              </div>
            ) : lyrics.map((lyric) => (
              <div key={lyric.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-medium">{lyric.title}</p>
                    <p className="text-gray-400 text-sm">{lyric.genre} · {lyric.mood}</p>
                  </div>
                  <button onClick={() => removeLyric(lyric.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans line-clamp-3">{lyric.content}</pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-3">
            {videos.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No videos yet. <Link href="/video-generator" className="text-[#00ff87] hover:underline">Generate one</Link></p>
              </div>
            ) : videos.map((video) => (
              <div key={video.id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{video.title}</p>
                  <p className="text-gray-400 text-sm">{video.duration}s</p>
                </div>
                <button onClick={() => removeVideo(video.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
