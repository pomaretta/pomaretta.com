import { Navigation } from '@/components/layout/Navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getBlogPosts } from '@/lib/notion/queries'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
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
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground">
                Thoughts, tutorials, and insights on web development
              </p>
            </div>

            {posts.length === 0 ? (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No blog posts yet. Check back soon!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Make sure to configure your Notion database in .env.local
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                    <Card className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20">
                      {post.cover && (
                        <div className="relative h-48 md:h-64 w-full overflow-hidden">
                          <Image
                            src={post.cover}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.published).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              {post.readingTime && (
                                <span className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {post.readingTime} min read
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-white/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="group-hover:text-primary">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
