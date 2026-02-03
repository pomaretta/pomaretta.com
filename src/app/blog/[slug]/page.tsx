import { Navigation } from '@/components/layout/Navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/notion/queries'
import { parseNotionBlocks } from '@/lib/notion/parser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.published,
      images: post.cover ? [post.cover] : [],
    },
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 pt-24 py-20 px-4">
        <article className="container max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-8 hover:bg-white/10">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 md:p-10 shadow-lg shadow-black/10">
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published} className="text-sm">
                    {new Date(post.published).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{post.readingTime} min read</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
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
                    alt={post.title}
                    fill
                    className="rounded-lg shadow-md object-cover"
                    priority
                  />
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <p className="text-lg text-muted-foreground leading-relaxed">{post.summary}</p>
              </div>
            </header>

            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
              prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-muted-foreground prose-li:marker:text-primary
              prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-white/10 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-inner
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              {parseNotionBlocks(post.content as any || [])}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="ghost" asChild className="hover:bg-white/10">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
              </Link>
            </Button>
          </div>
        </article>
      </main>
    </div>
  )
}
