'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { GraduationCap, Code2, Bike, Lightbulb } from 'lucide-react'

export function BeyondCode() {
  const { t } = useLanguage()

  const sections = [
    {
      icon: GraduationCap,
      title: t.beyondCode.selfTaught.title,
      description: t.beyondCode.selfTaught.description,
    },
    {
      icon: Code2,
      title: t.beyondCode.sideProjects.title,
      description: t.beyondCode.sideProjects.description,
    },
    {
      icon: Bike,
      title: t.beyondCode.lifestyle.title,
      description: t.beyondCode.lifestyle.description,
    },
    {
      icon: Lightbulb,
      title: t.beyondCode.drive.title,
      description: t.beyondCode.drive.description,
    },
  ]

  return (
    <section className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.beyondCode.title}
          </h2>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <FadeInUp key={index} delay={0.3 + index * 0.1}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10">
                <section.icon className="h-6 w-6 text-muted-foreground mb-3" />
                <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {section.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}
