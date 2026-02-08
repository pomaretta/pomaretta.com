import { Navigation } from '@/components/layout/Navigation'
import { BlogPostDisplay } from '@/components/blog/BlogPostDisplay'
import { BackToBlogButton } from '@/components/blog/BackToBlogButton'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog/queries'
import { getLocalizedContent } from '@/lib/i18n/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { generateStructuredData } from '@/components/StructuredData'
import Script from 'next/script'

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

  // Use English version for metadata, fallback to the content if it's a string
  const title = getLocalizedContent(post.title, 'en')
  const summary = getLocalizedContent(post.summary, 'en')

  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
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

  // Generate structured data for the article using English content for SEO
  const titleForSeo = getLocalizedContent(post.title, 'en')
  const summaryForSeo = getLocalizedContent(post.summary, 'en')
  
  const structuredData = generateStructuredData({
    type: 'article',
    title: titleForSeo,
    description: summaryForSeo,
    image: post.cover,
    datePublished: post.published,
    dateModified: post.published,
  })

  // Escape dangerous characters to prevent script injection
  const jsonLd = JSON.stringify(structuredData)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 pt-24 py-20 px-4">
          <article className="container max-w-4xl mx-auto">
            <BackToBlogButton />

            <BlogPostDisplay post={post} />

            <div className="mt-8 flex justify-center">
              <BackToBlogButton variant="backToBlog" className="hover:bg-white/10" />
            </div>
          </article>
        </main>
      </div>
    </>
  )
}
