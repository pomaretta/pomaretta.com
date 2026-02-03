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
          className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        >
          {children}
        </button>
      )
    }

    return (
      <Link
        href={`/#${sectionId}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
      >
        {children}
      </Link>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Theme Toggle */}
          <div className="flex justify-start">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
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

          {/* Center: Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
            <NavLink sectionId="about">{t.nav.about}</NavLink>
            <NavLink sectionId="experience">{t.nav.experience}</NavLink>
            <NavLink sectionId="skills">{t.nav.skills}</NavLink>
            {/* <NavLink sectionId="blog">{t.nav.blog}</NavLink> */}
            <NavLink sectionId="contact">{t.nav.contact}</NavLink>
          </div>

          {/* Right: Language Toggle, Contact Button */}
          <div className="flex items-center justify-end gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  locale === 'en'
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLocale('es')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  locale === 'es'
                    ? 'bg-white/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ES
              </button>
            </div>

            {/* Contact Button */}
            {isHomePage ? (
              <button
                onClick={() => scrollToSection('contact')}
                className="hidden sm:block px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-sm transition-colors border border-white/10"
              >
                {t.nav.contact}
              </button>
            ) : (
              <Link
                href="/#contact"
                className="hidden sm:block px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-sm transition-colors border border-white/10"
              >
                {t.nav.contact}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
