import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
  id: string
  title: string
  genre: string
  mood: string
  duration: number
  audioUrl: string
  coverUrl?: string
  createdAt: string
  bpm: number
  voiceModel: string
}

export interface VideoProject {
  id: string
  title: string
  prompt: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  createdAt: string
}

export interface LyricEntry {
  id: string
  title: string
  genre: string
  mood: string
  content: string
  createdAt: string
}

export interface StemResult {
  id: string
  originalFile: string
  stems: {
    vocals: string
    drums: string
    bass: string
    other: string
  }
  createdAt: string
}

interface AppStore {
  tracks: Track[]
  videos: VideoProject[]
  lyrics: LyricEntry[]
  stems: StemResult[]
  credits: number
  addTrack: (track: Track) => void
  addVideo: (video: VideoProject) => void
  addLyric: (lyric: LyricEntry) => void
  addStem: (stem: StemResult) => void
  removeTrack: (id: string) => void
  removeVideo: (id: string) => void
  removeLyric: (id: string) => void
  deductCredits: (amount: number) => void
  rechargeCredits: (amount: number) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      tracks: [],
      videos: [],
      lyrics: [],
      stems: [],
      credits: 650,
      addTrack: (track) => set((s) => ({ tracks: [track, ...s.tracks] })),
      addVideo: (video) => set((s) => ({ videos: [video, ...s.videos] })),
      addLyric: (lyric) => set((s) => ({ lyrics: [lyric, ...s.lyrics] })),
      addStem: (stem) => set((s) => ({ stems: [stem, ...s.stems] })),
      removeTrack: (id) => set((s) => ({ tracks: s.tracks.filter(t => t.id !== id) })),
      removeVideo: (id) => set((s) => ({ videos: s.videos.filter(v => v.id !== id) })),
      removeLyric: (id) => set((s) => ({ lyrics: s.lyrics.filter(l => l.id !== id) })),
      deductCredits: (amount) => set((s) => ({ credits: Math.max(0, s.credits - amount) })),
      rechargeCredits: (amount) => set((s) => ({ credits: s.credits + amount })),
    }),
    { name: 'dieter-pro-store' }
  )
)
