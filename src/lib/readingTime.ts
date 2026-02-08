// Calculate reading time based on word count
// Average reading speed: 200-250 words per minute
// We'll use 225 as a middle ground

import { countWordsInMarkdown, extractTextFromMarkdown } from './blog/parser'

interface NotionBlock {
  type: string
  [key: string]: any
}

// Legacy function for Notion blocks (keeping for backwards compatibility)
export function calculateReadingTimeFromBlocks(blocks: NotionBlock[]): number {
  const WORDS_PER_MINUTE = 225

  let totalWords = 0

  for (const block of blocks) {
    let text = ''

    switch (block.type) {
      case 'paragraph':
        text = block.paragraph?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'heading_1':
        text = block.heading_1?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'heading_2':
        text = block.heading_2?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'heading_3':
        text = block.heading_3?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'bulleted_list_item':
        text = block.bulleted_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'numbered_list_item':
        text = block.numbered_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'quote':
        text = block.quote?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        break
      case 'code':
        // Code blocks typically take longer to read, so we'll count them at 50% speed
        text = block.code?.rich_text?.map((t: any) => t.plain_text).join('') || ''
        const codeWords = text.trim().split(/\s+/).length
        totalWords += Math.ceil(codeWords * 1.5) // Add 50% more time for code
        continue
    }

    // Count words (split by whitespace)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    totalWords += words.length
  }

  // Calculate minutes (round up to nearest minute, minimum 1)
  const minutes = Math.ceil(totalWords / WORDS_PER_MINUTE)
  return Math.max(1, minutes)
}

// Main function for calculating reading time from markdown content
export function calculateReadingTime(content: string | NotionBlock[]): number {
  const WORDS_PER_MINUTE = 225

  // Handle both string (markdown) and array (Notion blocks) input
  if (typeof content === 'string') {
    const wordCount = countWordsInMarkdown(content)
    
    // Give code blocks extra weight (they take longer to read)
    const codeBlockMatches = content.match(/```[\s\S]*?```/g) || []
    const codeWords = codeBlockMatches.reduce((total, block) => {
      const codeContent = block.replace(/```/g, '').trim()
      return total + codeContent.split(/\s+/).length
    }, 0)
    
    // Regular content + 50% extra time for code blocks
    const totalWords = wordCount - codeWords + Math.ceil(codeWords * 1.5)
    
    const minutes = Math.ceil(totalWords / WORDS_PER_MINUTE)
    return Math.max(1, minutes)
  } else {
    // Legacy Notion blocks support
    return calculateReadingTimeFromBlocks(content)
  }
}

// Simpler version that works with plain text
export function calculateReadingTimeFromText(text: string): number {
  const WORDS_PER_MINUTE = 225
  const words = text.trim().split(/\s+/).filter(word => word.length > 0)
  const minutes = Math.ceil(words.length / WORDS_PER_MINUTE)
  return Math.max(1, minutes)
}
