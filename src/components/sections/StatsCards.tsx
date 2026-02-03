'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { Calendar, Code2, FolderGit2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function StatsCards() {
  const { t } = useLanguage()

  const stats = [
    {
      value: '5',
      label: t.hero.stats.experience,
      icon: Calendar,
      delay: 0.7,
    },
    {
      value: '50+',
      label: t.hero.stats.technologies,
      icon: Code2,
      delay: 0.8,
    },
    {
      value: '25+',
      label: t.hero.stats.projects,
      icon: FolderGit2,
      delay: 0.9,
    },
    {
      value: '∞',
      label: t.hero.stats.learning,
      icon: Sparkles,
      delay: 1.0,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
      {stats.map((stat, index) => (
        <FadeInUp key={index} delay={stat.delay}>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10">
            <stat.icon className="h-5 w-5 text-muted-foreground mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        </FadeInUp>
      ))}
    </div>
  )
}
