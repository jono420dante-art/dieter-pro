'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Music,
  Video,
  Zap,
  FileText,
  Scissors,
  Sliders,
  Compass,
  Library,
  Clock,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

const navItems = [
  { href: '/', icon: Home, label: 'Home', section: null },
  { href: '/music-generator', icon: Music, label: 'Music Studio', section: 'STUDIO', badge: 'NEW' },
  { href: '/video-generator', icon: Video, label: 'Video Suite', section: 'STUDIO' },
  { href: '/create', icon: Zap, label: 'Quick Create', section: 'STUDIO' },
  { href: '/lyrics', icon: FileText, label: 'Lyrics AI', section: 'STUDIO' },
  { href: '/stem-splitter', icon: Scissors, label: 'Stem Splitter', section: 'STUDIO' },
  { href: '/mixer', icon: Sliders, label: 'Mixer Pro', section: 'STUDIO' },
  { href: '/explore', icon: Compass, label: 'Explore', section: 'DISCOVER' },
  { href: '/library', icon: Library, label: 'My Library', section: 'DISCOVER' },
  { href: '/history', icon: Clock, label: 'History', section: 'DISCOVER' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { credits } = useAppStore()

  const sections = ['STUDIO', 'DISCOVER']

  return (
    <aside className="w-56 min-h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00ff87] flex items-center justify-center">
            <Music className="w-4 h-4 text-black" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">DIETER PRO</p>
            <p className="text-gray-500 text-xs">AI Music Studio</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>

        {sections.map(section => {
          const sectionItems = navItems.filter(item => item.section === section)
          return (
            <div key={section} className="pt-3">
              <p className="text-[10px] font-semibold text-gray-600 px-3 mb-1 tracking-wider">{section}</p>
              {sectionItems.map(({ href, icon: Icon, label, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === href
                      ? 'bg-[#00ff87]/10 text-[#00ff87]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[10px] bg-[#00ff87] text-black px-1.5 py-0.5 rounded font-bold">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Credits Bar */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Credits</span>
          <span className="text-xs text-[#00ff87] font-medium">{credits}/1000</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00ff87] rounded-full transition-all"
            style={{ width: `${(credits / 1000) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
