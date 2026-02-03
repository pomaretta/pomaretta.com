'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Github, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/config/site'
import Image from 'next/image'

export function GitHubActivity() {
  const { t } = useLanguage()

  // Extract username from GitHub URL
  const githubUsername = siteConfig.links.github.split('/').pop() || 'pomaretta'

  return (
    <section className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Github className="h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold">{t.github.title}</h2>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-lg shadow-black/10">
            {/* GitHub Contribution Graph */}
            <div className="mb-6 relative w-full h-32">
              <Image
                src={`https://ghchart.rshah.org/${githubUsername}`}
                alt={`${githubUsername}'s GitHub contribution graph`}
                fill
                className="rounded-lg object-contain"
                style={{ filter: 'invert(1) hue-rotate(180deg)' }}
                unoptimized
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">~1000+</div>
                <div className="text-sm text-muted-foreground">{t.github.contributions}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">25+</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">5</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
            </div>

            {/* View Profile Button */}
            <div className="text-center">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full transition-colors border border-white/10"
              >
                <span>{t.github.viewProfile}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
