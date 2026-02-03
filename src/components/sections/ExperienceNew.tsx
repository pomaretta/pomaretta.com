'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { experiencesDetailed } from '@/data/experience-detailed'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Briefcase } from 'lucide-react'

export function ExperienceNew() {
  const { t, locale } = useLanguage()

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <section id="experience" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">{t.experience.title}</h2>
        </FadeInUp>

        <div className="space-y-10">
          {experiencesDetailed.map((exp, idx) => (
            <FadeInUp key={exp.id} delay={0.3 + idx * 0.1}>
              <article className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10">
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="text-muted-foreground">
                      {exp.company} • {formatDate(exp.startDate)} -{' '}
                      {exp.endDate ? formatDate(exp.endDate) : t.experience.present}
                    </p>
                    <p className="text-sm text-muted-foreground">{exp.location}</p>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-4">{exp.description}</p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">{t.experience.achievements}:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">{t.experience.technologies}:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-white/10 rounded-full border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}
