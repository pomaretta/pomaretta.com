'use client'

import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BackToBlogButtonProps {
  className?: string
  variant?: 'default' | 'backToBlog'
}

export function BackToBlogButton({ className = "mb-8 hover:bg-white/10", variant = 'default' }: BackToBlogButtonProps) {
  const { t } = useLanguage()
  
  const buttonText = variant === 'backToBlog' ? t.blog.backToAllPosts : t.blog.backToBlog

  return (
    <Button variant="ghost" asChild className={className}>
      <Link href="/blog">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {buttonText}
      </Link>
    </Button>
  )
}