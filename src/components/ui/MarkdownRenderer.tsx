'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <article className={cn(
      'prose prose-lg dark:prose-invert max-w-none',
      'prose-headings:font-bold prose-headings:tracking-tight',
      'prose-p:text-foreground prose-p:leading-relaxed',
      'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
      'prose-strong:text-foreground prose-strong:font-semibold',
      'prose-code:text-foreground prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-medium',
      'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
      'prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg',
      'prose-table:bg-card prose-table:border prose-table:border-border',
      'prose-thead:bg-muted prose-th:border-border prose-th:px-4 prose-th:py-3',
      'prose-td:border-border prose-td:px-4 prose-td:py-3',
      'prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:shadow-md prose-img:w-full',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom image component with Next.js optimization
          img: ({ src, alt, className }) => {
            if (!src || typeof src !== 'string') return null
            
            return (
              <Image
                src={src}
                alt={alt || ''}
                width={800}
                height={400}
                className={`w-full h-auto rounded-lg border border-border shadow-md ${className || ''}`}
              />
            )
          },
          
          // Custom code component with syntax highlighting
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            const inline = !language

            if (!inline && language) {
              return (
                <div className="relative group">
                  <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-md border border-b-0 border-border">
                    <span className="text-xs text-muted-foreground font-medium">
                      {language}
                    </span>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
                      onClick={() => {
                        const text = String(children).replace(/\n$/, '')
                        navigator.clipboard.writeText(text).then(() => {
                          // Handle copy feedback
                        })
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={mounted && theme === 'dark' ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              )
            }

            return (
              <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                {children}
              </code>
            )
          },
          
          // Enhanced blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-l-primary bg-muted/30 px-6 py-4 rounded-r-lg italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          
          // Enhanced tables
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-card border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}