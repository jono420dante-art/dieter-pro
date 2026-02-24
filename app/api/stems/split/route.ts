import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN not configured' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('audio') as File

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Using Demucs for stem separation
    const output = await replicate.run(
      'ryan5453/demucs:7a9db77079d3a528c97e9bd3fa7c5a1c0d98bb8e5b9d9a4a1d9a9b5d8c7e6f4',
      {
        input: {
          audio: dataUrl,
          model: 'htdemucs',
          stem: 'none',
          output_format: 'mp3',
        },
      }
    ) as { vocals: string; drums: string; bass: string; other: string }

    return NextResponse.json({
      vocals: output.vocals || '',
      drums: output.drums || '',
      bass: output.bass || '',
      other: output.other || '',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[stems/split]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
