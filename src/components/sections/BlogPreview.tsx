'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

// Preview blog posts - matches mock blog data
const dummyPosts = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js 15',
    summary: 'Exploring the powerful features of Next.js 15 App Router, Server Components, and how they revolutionize web development.',
    date: '2024-01-15',
    slug: 'nextjs-15-modern-web-apps',
  },
  {
    id: '2',
    title: 'The Power of TypeScript in Large-Scale Applications',
    summary: 'How TypeScript helps build maintainable, scalable applications with better developer experience and fewer runtime errors.',
    date: '2024-01-08',
    slug: 'typescript-large-scale-apps',
  },
  {
    id: '3',
    title: 'Mastering Tailwind CSS: Tips and Best Practices',
    summary: 'Advanced techniques and patterns for building beautiful, responsive UIs with Tailwind CSS utility-first approach.',
    date: '2023-12-20',
    slug: 'mastering-tailwind-css',
  },
]

export function BlogPreview() {
  const { t, locale } = useLanguage()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <section id="blog" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.blog.title}
          </h2>
        </FadeInUp>

        <div className="space-y-6">
          {dummyPosts.map((post, index) => (
            <FadeInUp key={post.id} delay={0.3 + index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <article className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10 group">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <time>{formatDate(post.date)}</time>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-muted-foreground transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <span>{t.blog.readMore}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            </FadeInUp>
          ))}
        </div>

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
