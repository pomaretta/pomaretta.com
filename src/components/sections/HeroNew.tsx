'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { StatsCards } from './StatsCards'
import { MapPin, Github, Linkedin } from 'lucide-react'
import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function HeroNew() {
  const { t } = useLanguage()

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6">
          <FadeInUp delay={0.2}>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-white/10">
              <Image
                src="https://media.licdn.com/dms/image/v2/C4D03AQE5yAexbw3YGA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1617052734855?e=2147483647&v=beta&t=qa-KIkUH6iprVlgAaF-fV0Vtmll7pRvrcFT0zye4R40"
                alt="Carlos Pomares"
                fill
                className="object-cover"
                priority
              />
            </div>
          </FadeInUp>

          <FadeInUp delay={0.3}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Palma, Balearic Islands, Spain</span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.35}>
            <div className="flex items-center gap-4">
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
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Carlos Pomares
            </h1>
          </FadeInUp>

          <FadeInUp delay={0.5}>
            <p className="text-xl md:text-2xl text-muted-foreground">
              {t.hero.title}
            </p>
          </FadeInUp>

          <FadeInUp delay={0.6}>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.hero.bio}
            </p>
          </FadeInUp>

          <StatsCards />
        </div>
      </div>
    </section>
  )
}
