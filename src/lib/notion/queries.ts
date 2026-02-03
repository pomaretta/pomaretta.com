import { notion, BLOG_DATABASE_ID } from './client'
import { BlogPost } from '@/types'
import { mockBlogPosts, mockNotionBlocks } from '@/data/mockBlogData'
import { calculateReadingTime } from '@/lib/readingTime'

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!BLOG_DATABASE_ID) {
    console.warn('NOTION_BLOG_DATABASE_ID is not configured, using mock data')
    return mockBlogPosts
  }

  try {
    const response = await (notion.databases as any).query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published',
        },
      },
      sorts: [
        {
          property: 'Published',
          direction: 'descending',
        },
      ],
    })

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
      summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
      published: page.properties.Published?.date?.start || '',
      tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      cover: page.cover?.external?.url || page.cover?.file?.url,
      featured: page.properties.Featured?.checkbox || false,
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  if (!BLOG_DATABASE_ID) {
    console.warn('NOTION_BLOG_DATABASE_ID is not configured, using mock data')
    const post = mockBlogPosts.find((p) => p.slug === slug)
    if (!post) return null

    return {
      ...post,
      content: mockNotionBlocks[slug] || [],
    }
  }

  try {
    const response = await (notion.databases as any).query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'Published',
            },
          },
        ],
      },
    })

    if (response.results.length === 0) {
      return null
    }

    const page: any = response.results[0]

    // Fetch page content blocks
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    })

    const readingTime = calculateReadingTime(blocks.results as any)

    return {
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || '',
      summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
      published: page.properties.Published?.date?.start || '',
      tags: page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      cover: page.cover?.external?.url || page.cover?.file?.url,
      readingTime,
      content: blocks.results,
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}
