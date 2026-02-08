import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog/queries'
import { siteConfig } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Static routes
  const routes = [
    {
      url: baseUrl,
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic blog post routes
  try {
    const posts = await getBlogPosts()
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...routes, ...blogRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}
