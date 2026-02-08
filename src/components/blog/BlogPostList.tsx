'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getLocalizedContent } from '@/lib/i18n/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock, Brain } from 'lucide-react'
import type { BlogPost } from '@/types'

interface BlogPostListProps {
  posts: BlogPost[]
}

export function BlogPostList({ posts }: BlogPostListProps) {
  const { locale, t } = useLanguage()

  if (posts.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border-white/10">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {t.blog.noPostsFound}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {t.blog.addPostsHelp}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => {
        const localizedTitle = getLocalizedContent(post.title, locale)
        const localizedSummary = getLocalizedContent(post.summary, locale)
        const localizedReadingTime = typeof post.readingTime === 'object' 
          ? post.readingTime[locale] 
          : post.readingTime

        return (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <Card className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20">
              {post.cover && (
                <div className="relative h-48 md:h-64 w-full overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={localizedTitle}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                      {localizedTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.published).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      {localizedReadingTime && (
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {localizedReadingTime} {locale === 'en' ? 'min read' : 'min de lectura'}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">{localizedSummary}</p>
                <div className="flex flex-wrap gap-2">
                  {post.aiAssisted && (
                    <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 font-medium">
                      <Brain className="w-3 h-3 mr-1" />
                      {locale === 'en' ? 'AI-Assisted' : 'Asistido por IA'}
                    </Badge>
                  )}
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="group-hover:text-primary">
                  {t.blog.readMore}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}