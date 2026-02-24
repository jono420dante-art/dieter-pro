import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, duration } = await req.json()

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN not configured' },
        { status: 500 }
      )
    }

    const videoPrompt = `${style} style music video: ${prompt}. Cinematic, high quality, professional production.`

    // Using Kling v1.6 for video generation
    const output = await replicate.run(
      'klingai/kling-v1-6-standard-image2video:f8a6e3e1e5c77d4f3e8d6c10b8f2a4b9d1e7c3a5b2f6d8e4c9a7b3f5e1d2c8',
      {
        input: {
          prompt: videoPrompt,
          duration: Math.min(duration || 5, 10),
          aspect_ratio: '16:9',
        },
      }
    ) as { video: string }

    const videoUrl = output?.video || (output as unknown as string)
    const thumbnailUrl = ''

    return NextResponse.json({ videoUrl, thumbnailUrl })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[video/generate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
