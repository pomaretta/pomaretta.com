import { Navigation } from '@/components/layout/Navigation'
import { BlogPostList } from '@/components/blog/BlogPostList'
import { BlogPageHeader } from '@/components/blog/BlogPageHeader'
import { getBlogPosts } from '@/lib/blog/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, tutorials, and insights on web development',
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 pt-24 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BlogPageHeader />
            <BlogPostList posts={posts} />
          </div>
        </div>
      </main>
    </div>
  )
}
