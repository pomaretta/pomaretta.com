'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { groupedTechStackNew } from '@/data/techstack-new'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function TechStackNew() {
  const { t } = useLanguage()

  return (
    <section id="skills" className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t.techStack.title}</h2>
        </FadeInUp>

        <div className="space-y-8">
          {Object.entries(groupedTechStackNew).map(([category, techs], idx) => (
            <FadeInUp key={category} delay={0.3 + idx * 0.05}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10">
                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                  {t.techStack.categories[category as keyof typeof t.techStack.categories]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {techs.map((tech) => (
                    <span
                      key={tech.name}
                      className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}
