import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { genre, mood, topic, style } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional songwriter and lyricist. Create compelling, original song lyrics based on the given parameters. Format lyrics with [Verse 1], [Chorus], [Verse 2], [Bridge] sections.',
        },
        {
          role: 'user',
          content: `Write ${genre} song lyrics with a ${mood} mood about: ${topic}. Style: ${style}. Include verse, chorus, and bridge sections.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const lyrics = completion.choices[0]?.message?.content || ''
    const title = `${genre} - ${topic}`.slice(0, 50)

    return NextResponse.json({ lyrics, title })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[lyrics/generate]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
