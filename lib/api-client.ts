// lib/api-client.ts
// Client-side API functions that call our Next.js API routes

export interface GenerateMusicParams {
  prompt: string
  genre: string
  mood: string
  bpm: number
  duration: number
  voiceModel: string
}

export interface GenerateMusicResult {
  audioUrl: string
  title: string
  duration: number
}

export async function generateMusic(params: GenerateMusicParams): Promise<GenerateMusicResult> {
  const response = await fetch('/api/music/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface GenerateLyricsParams {
  topic: string
  genre: string
  mood: string
  style: string
}

export interface GenerateLyricsResult {
  lyrics: string
  title: string
}

export async function generateLyrics(params: GenerateLyricsParams): Promise<GenerateLyricsResult> {
  const response = await fetch('/api/lyrics/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface GenerateVideoParams {
  prompt: string
  style: string
  duration: number
  aspectRatio: string
}

export interface GenerateVideoResult {
  videoUrl: string
  thumbnailUrl: string
  title: string
}

export async function generateVideo(params: GenerateVideoParams): Promise<GenerateVideoResult> {
  const response = await fetch('/api/video/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export interface SplitStemsParams {
  audioUrl: string
}

export interface StemResult {
  vocals: string
  drums: string
  bass: string
  other: string
}

export async function splitStems(params: SplitStemsParams): Promise<StemResult> {
  const response = await fetch('/api/stems/split', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}
