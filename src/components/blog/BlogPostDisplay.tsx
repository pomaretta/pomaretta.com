'use client'

import { Badge } from '@/components/ui/Badge'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getLocalizedContent } from '@/lib/i18n/utils'
import Image from 'next/image'
import { Calendar, Clock, Brain } from 'lucide-react'
import type { BlogPostDetail } from '@/types'

interface BlogPostDisplayProps {
  post: BlogPostDetail
}

export function BlogPostDisplay({ post }: BlogPostDisplayProps) {
  const { locale } = useLanguage()

  const localizedTitle = getLocalizedContent(post.title, locale)
  const localizedSummary = getLocalizedContent(post.summary, locale)
  const localizedContent = getLocalizedContent(post.content, locale)
  const localizedReadingTime = typeof post.readingTime === 'object' 
    ? post.readingTime[locale] 
    : post.readingTime

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 md:p-10 shadow-lg shadow-black/10">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{localizedTitle}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published} className="text-sm">
              {new Date(post.published).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          {localizedReadingTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {localizedReadingTime} {locale === 'en' ? 'min read' : 'min de lectura'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {post.aiAssisted && (
            <Badge variant="default" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-300/30 text-white font-medium">
              <Brain className="w-3 h-3 mr-1" />
              {locale === 'en' ? 'AI-Assisted' : 'Asistido por IA'}
            </Badge>
          )}
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-white/10">
              {tag}
            </Badge>
          ))}
        </div>

        {post.cover && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image
              src={post.cover}
              alt={localizedTitle}
              fill
              className="rounded-lg shadow-md object-cover"
              priority
            />
          </div>
        )}

        <div className="border-t border-white/10 pt-6">
          <p className="text-lg text-muted-foreground leading-relaxed">{localizedSummary}</p>
        </div>
      </header>

      <MarkdownRenderer content={localizedContent || ''} />
    </div>
  )
}