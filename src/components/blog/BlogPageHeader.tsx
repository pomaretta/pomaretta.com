'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export function BlogPageHeader() {
  const { t, locale } = useLanguage()

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {t.nav.blog}
      </h1>
      <p className="text-xl text-muted-foreground">
        {locale === 'en'
          ? 'Thoughts, tutorials, and insights on web development'
          : 'Reflexiones, tutoriales y conocimientos sobre desarrollo web'
        }
      </p>
    </div>
  )
}