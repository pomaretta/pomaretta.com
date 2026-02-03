'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { siteConfig } from '@/config/site'
import { Github, Linkedin } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function ContactNew() {
  const { t } = useLanguage()

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{t.contact.title}</h2>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {t.contact.description}
          </p>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <div className="flex gap-6">
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors group"
            >
              <Linkedin className="h-5 w-5" />
              <span className="text-lg font-medium group-hover:underline">
                LinkedIn
              </span>
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors group"
            >
              <Github className="h-5 w-5" />
              <span className="text-lg font-medium group-hover:underline">
                GitHub
              </span>
            </a>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
