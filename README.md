# DIETER PRO - AI Music Studio

A full-stack AI-powered music creation platform built with Next.js 14, OpenAI GPT-4o, and Replicate MusicGen.

## Features

- **Music Generator** — Real AI music via Replicate MusicGen (meta/musicgen)
- **Lyrics AI** — GPT-4o powered lyric generation with genre/mood/topic controls
- **Video Suite** — AI video generation via Replicate Kling/Flux.1
- **Stem Splitter** — Separate vocals, drums, bass, and other tracks via Demucs
- **Mixer Pro** — Multi-track mixing with waveform visualisation
- **Quick Create** — One-page rapid track generation
- **Explore** — Discover trending AI-generated tracks
- **Library** — Your saved tracks, videos, and lyrics
- **History** — Complete generation history

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State**: Zustand (persisted)
- **AI APIs**: OpenAI GPT-4o, Replicate (MusicGen, Demucs, Flux.1, Kling)
- **Audio**: Tone.js, WaveSurfer.js
- **Animations**: Framer Motion
- **Notifications**: Sonner

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/jono420dante-art/dieter-pro.git
cd dieter-pro
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env.local` file:
```env
OPENAI_API_KEY=sk-your-openai-key
REPLICATE_API_TOKEN=r8_your-replicate-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dieter-pro/
├── app/
│   ├── api/
│   │   ├── music/generate/route.ts
│   │   ├── lyrics/generate/route.ts
│   │   ├── video/generate/route.ts
│   │   └── stems/split/route.ts
│   ├── (pages)/
│   │   ├── page.tsx                 # Home
│   │   ├── create/page.tsx          # Quick Create
│   │   ├── music-generator/page.tsx
│   │   ├── lyrics/page.tsx
│   │   ├── video-generator/page.tsx
│   │   ├── stem-splitter/page.tsx
│   │   ├── mixer/page.tsx
│   │   ├── explore/page.tsx
│   │   ├── library/page.tsx
│   │   └── history/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── lib/
│   ├── utils.ts
│   ├── store.ts
│   └── api-client.ts
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Replicate**: https://replicate.com/account/api-tokens

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jono420dante-art/dieter-pro)

Add your environment variables in the Vercel dashboard under Settings > Environment Variables.

## License

MIT
