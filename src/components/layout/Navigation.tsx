'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { locale, setLocale, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === '/'

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const NavLink = ({ sectionId, children }: { sectionId: string; children: React.ReactNode }) => {
    if (isHomePage) {
      return (
        <button
          onClick={() => scrollToSection(sectionId)}
          className="text-sm text-muted-foreground hover:text-foreground transition-all whitespace-nowrap px-2 py-1 rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {children}
        </button>
      )
    }

    return (
      <Link
        href={`/#${sectionId}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-all whitespace-nowrap px-2 py-1 rounded-lg hover:bg-white/5"
      >
        {children}
      </Link>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Left Island: Theme Toggle - Circular */}
          <div className="flex justify-start">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-full bg-background/60 backdrop-blur-xl border border-white/10 hover:bg-background/80 hover:border-white/20 transition-all shadow-lg shadow-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Center Island: Navigation Links - Elongated pill (centered) */}
          <div className="hidden md:flex items-center gap-1 px-4 py-2.5 bg-background/60 backdrop-blur-xl rounded-[20px] border border-white/10 shadow-lg shadow-black/5">
            <NavLink sectionId="about">{t.nav.about}</NavLink>
            <span className="text-muted-foreground/30 mx-1" aria-hidden="true">•</span>
            <NavLink sectionId="experience">{t.nav.experience}</NavLink>
            <span className="text-muted-foreground/30 mx-1" aria-hidden="true">•</span>
            <NavLink sectionId="skills">{t.nav.skills}</NavLink>
            {/* <span className="text-muted-foreground/30 mx-1">•</span> */}
            {/* <NavLink sectionId="blog">{t.nav.blog}</NavLink> */}
            <span className="text-muted-foreground/30 mx-1" aria-hidden="true">•</span>
            <NavLink sectionId="contact">{t.nav.contact}</NavLink>
          </div>

          {/* Right Island: Language - Squircle shape */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-background/60 backdrop-blur-xl rounded-[16px] p-1 border border-white/10 shadow-lg shadow-black/5">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1.5 text-sm rounded-[12px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  locale === 'en'
                    ? 'bg-white/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('es')}
                className={`px-3 py-1.5 text-sm rounded-[12px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  locale === 'es'
                    ? 'bg-white/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
