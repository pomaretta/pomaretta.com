import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, BlogPostDetail } from '@/types'
import { calculateReadingTime } from '@/lib/readingTime'
import { parseMultiLanguageContent, hasMultiLanguageContent } from '@/lib/i18n/utils'

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'blog')
  
  // Create blog directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  
  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const filePath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      // Extract slug from filename (remove date and .md extension)
      const slug = name
        .replace(/^\d{4}-\d{2}-\d{2}-/, '') // Remove YYYY-MM-DD- prefix
        .replace(/\.md$/, '') // Remove .md suffix
      
      // Handle multi-language content
      const isMultiLang = hasMultiLanguageContent(content)
      const parsedContent = isMultiLang ? parseMultiLanguageContent(content) : content
      
      // Calculate reading time for each language
      let readingTime: number | { en: number; es: number }
      if (isMultiLang && typeof parsedContent === 'object') {
        readingTime = {
          en: calculateReadingTime(parsedContent.en),
          es: calculateReadingTime(parsedContent.es),
        }
      } else {
        readingTime = calculateReadingTime(content)
      }

      // Handle multi-language titles and summaries
      const title = typeof data.title === 'object' ? data.title : (data.title || 'Untitled')
      const summary = typeof data.summary === 'object' ? data.summary : (data.summary || '')

      return {
        id: slug,
        title,
        slug,
        summary,
        published: data.date || '',
        tags: data.tags || [],
        cover: data.cover || null,
        featured: data.featured || false,
        readingTime,
        // Store the published boolean for filtering
        isPublished: data.published === true,
        aiAssisted: data.aiAssisted || false,
      }
    })
    .filter(post => post.isPublished) // Only published posts
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    
  return posts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const postsDirectory = path.join(process.cwd(), 'blog')
  
  if (!fs.existsSync(postsDirectory)) {
    return null
  }

  const filenames = fs.readdirSync(postsDirectory)
  
  // Find file that ends with the slug
  const fileName = filenames.find(name => 
    name.endsWith(`${slug}.md`)
  )
  
  if (!fileName) {
    return null
  }

  const filePath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  // Extract slug from filename (remove date and .md extension)
  const extractedSlug = fileName
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // Remove YYYY-MM-DD- prefix
    .replace(/\.md$/, '') // Remove .md suffix
  
  // Handle multi-language content
  const isMultiLang = hasMultiLanguageContent(content)
  const parsedContent = isMultiLang ? parseMultiLanguageContent(content) : content
  
  // Calculate reading time for each language
  let readingTime: number | { en: number; es: number }
  if (isMultiLang && typeof parsedContent === 'object') {
    readingTime = {
      en: calculateReadingTime(parsedContent.en),
      es: calculateReadingTime(parsedContent.es),
    }
  } else {
    readingTime = calculateReadingTime(content)
  }

  // Check if post is published
  if (data.published !== true) {
    return null
  }

  // Handle multi-language titles and summaries
  const title = typeof data.title === 'object' ? data.title : (data.title || 'Untitled')
  const summary = typeof data.summary === 'object' ? data.summary : (data.summary || '')

  return {
    id: extractedSlug,
    title,
    slug: extractedSlug,
    summary,
    published: data.date || '',
    tags: data.tags || [],
    cover: data.cover || null,
    featured: data.featured || false,
    readingTime,
    aiAssisted: data.aiAssisted || false,
    content: parsedContent,
  }
}