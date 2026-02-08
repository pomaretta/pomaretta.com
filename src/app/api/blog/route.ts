import { getBlogPosts } from '@/lib/blog/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = await getBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60