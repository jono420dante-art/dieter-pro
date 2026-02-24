'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Scissors, Upload, Loader2, ArrowLeft, Download, Music } from 'lucide-react'
import Link from 'next/link'
import { splitStems } from '@/lib/api-client'
import { useAppStore } from '@/lib/store'
import { generateId } from '@/lib/utils'

export default function StemSplitterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [stems, setStems] = useState<{ vocals: string; drums: string; bass: string; other: string } | null>(null)
  const { addStem, deductCredits } = useAppStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const audioFile = acceptedFiles.find(f => f.type.startsWith('audio/'))
    if (audioFile) {
      setFile(audioFile)
      toast.success(`File loaded: ${audioFile.name}`)
    } else {
      toast.error('Please upload an audio file (MP3, WAV, FLAC)')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.m4a', '.ogg'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  const handleSplit = async () => {
    if (!file) {
      toast.error('Please upload an audio file first')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('audio', file)
      const result = await splitStems(formData)
      setStems(result)
      addStem({
        id: generateId(),
        originalFile: file.name,
        stems: result,
        createdAt: new Date().toISOString(),
      })
      deductCredits(15)
      toast.success('Stems separated successfully!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Stem splitting failed')
    } finally {
      setLoading(false)
    }
  }

  const stemColors = {
    vocals: 'text-blue-400',
    drums: 'text-red-400',
    bass: 'text-yellow-400',
    other: 'text-green-400',
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Scissors className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Stem Splitter</h1>
            <p className="text-gray-400">Separate vocals, drums, bass & more via Demucs</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-[#00ff87] bg-[#00ff87]/5'
                : file
                ? 'border-[#00ff87]/50 bg-[#00ff87]/5'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            {file ? (
              <div>
                <p className="text-[#00ff87] font-medium">{file.name}</p>
                <p className="text-gray-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-300 font-medium">Drop audio file here or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">MP3, WAV, FLAC, M4A up to 50MB</p>
              </div>
            )}
          </div>

          <button
            onClick={handleSplit}
            disabled={loading || !file}
            className="w-full bg-[#00ff87] hover:bg-[#00cc6a] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Splitting Stems...</>
            ) : (
              <><Scissors className="w-5 h-5" /> Split Stems (15 credits)</>
            )}
          </button>
        </div>

        {stems && (
          <div className="glass-card p-6 mt-6">
            <h3 className="text-white font-semibold mb-4">Separated Stems</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stems).map(([stemName, url]) => (
                <div key={stemName} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium capitalize ${stemColors[stemName as keyof typeof stemColors]}`}>
                      {stemName}
                    </span>
                    {url && (
                      <a href={url} download={`${stemName}.mp3`} className="p-1 hover:bg-white/10 rounded">
                        <Download className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                  {url ? (
                    <audio src={url} controls className="w-full h-8" />
                  ) : (
                    <p className="text-gray-500 text-sm">Not available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
