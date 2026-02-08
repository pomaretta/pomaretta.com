'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getLocalizedContent } from '@/lib/i18n/utils'
import { ArrowRight, Calendar, Clock, Brain } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { BlogPost } from '@/types'
import { Badge } from '@/components/ui/Badge'

export function BlogPreview() {
  const { t, locale } = useLanguage()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()
        setPosts(data.slice(0, 3)) // Show only first 3 posts
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Check if post is recent (last 30 days)
  const isRecentPost = (dateStr: string) => {
    const postDate = new Date(dateStr)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return postDate > thirtyDaysAgo
  }

  if (loading) {
    return (
      <section id="blog" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInUp delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {t.blog.title}
            </h2>
          </FadeInUp>
          <div className="flex justify-center">
            <div className="text-muted-foreground">Loading posts...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.blog.title}
          </h2>
        </FadeInUp>

        {posts.length === 0 ? (
          <FadeInUp delay={0.3}>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">
                {t.blog.noPostsFound}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.blog.addPostsHelp}
              </p>
            </div>
          </FadeInUp>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => {
              const localizedTitle = getLocalizedContent(post.title, locale)
              const localizedSummary = getLocalizedContent(post.summary, locale)
              const localizedReadingTime = typeof post.readingTime === 'object' 
                ? post.readingTime[locale] 
                : post.readingTime

              return (
                <FadeInUp key={post.id} delay={0.3 + index * 0.1}>
                  <Link href={`/blog/${post.slug}`}>
                    <article className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10 group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time>{formatDate(post.published)}</time>
                          </div>
                          {localizedReadingTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{localizedReadingTime} {locale === 'en' ? 'min read' : 'min de lectura'}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isRecentPost(post.published) && (
                            <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-medium text-xs">
                              {t.blog.newBadge}
                            </Badge>
                          )}
                          {post.aiAssisted && (
                            <Badge variant="default" className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-300/30 text-white font-medium text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              {locale === 'en' ? 'AI-Assisted' : 'Asistido por IA'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-muted-foreground transition-colors">
                        {localizedTitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {localizedSummary}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <span>{t.blog.readMore}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </article>
                  </Link>
                </FadeInUp>
              )
            })}
          </div>
        )}

        <FadeInUp delay={0.7}>
          <div className="text-center mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full transition-colors border border-white/10"
            >
              <span>{t.blog.viewAll}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
