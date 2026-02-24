import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt, genre, mood, bpm, duration, voiceModel } = await req.json()

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN not configured' },
        { status: 500 }
      )
    }

    const musicPrompt = `${genre} music, ${mood} mood, ${bpm} BPM, ${prompt}. High quality studio production.`

    const output = await replicate.run(
      'meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043692f1600cdb4f23a0f2e6e5bc',
      {
        input: {
          prompt: musicPrompt,
          model_version: 'stereo-large',
          output_format: 'mp3',
          output_quality: 'high',
          normalization_strategy: 'peak',
          duration: Math.min(duration, 30),
        },
      }
    )

    const audioUrl = Array.isArray(output) ? output[0] : (output as string)
    const title = `${genre} - ${mood} Track`

    return NextResponse.json({ audioUrl, title })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[music/generate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
