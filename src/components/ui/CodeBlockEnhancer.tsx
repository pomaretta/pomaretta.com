'use client'

import { useEffect } from 'react'

interface CodeBlockEnhancerProps {
  children: React.ReactNode
}

export function CodeBlockEnhancer({ children }: CodeBlockEnhancerProps) {
  useEffect(() => {
    const handleCopyClick = async (event: Event) => {
      const target = event.target as HTMLElement
      if (!target.classList.contains('copy-button')) return

      const codeBlock = target.closest('.code-block-container')?.querySelector('code')
      if (!codeBlock) return

      try {
        const text = codeBlock.textContent || ''
        await navigator.clipboard.writeText(text)
        
        // Visual feedback
        const originalText = target.textContent
        target.textContent = 'Copied!'
        target.classList.add('copied')
        
        setTimeout(() => {
          target.textContent = originalText
          target.classList.remove('copied')
        }, 2000)
      } catch (error) {
        console.error('Failed to copy code:', error)
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = codeBlock.textContent || ''
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          const originalText = target.textContent
          target.textContent = 'Copied!'
          target.classList.add('copied')
          
          setTimeout(() => {
            target.textContent = originalText
            target.classList.remove('copied')
          }, 2000)
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError)
          target.textContent = 'Copy failed'
          setTimeout(() => {
            target.textContent = 'Copy'
          }, 2000)
        }
        document.body.removeChild(textArea)
      }
    }

    // Add event listeners to all copy buttons
    document.addEventListener('click', handleCopyClick)

    return () => {
      document.removeEventListener('click', handleCopyClick)
    }
  }, [])

  return <>{children}</>
}