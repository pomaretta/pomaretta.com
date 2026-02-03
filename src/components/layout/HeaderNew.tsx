'use client'

import { Github, Linkedin } from 'lucide-react'
import { siteConfig } from '@/config/site'

export function HeaderNew() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-end">
          <nav className="flex items-center gap-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
