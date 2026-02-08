import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create a DOM purify instance for server-side
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

// Configure marked with proper highlight.js integration
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight: function(code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(code, { language }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    return code
  }
}))

marked.setOptions({
  gfm: true,
  breaks: true
})

interface MarkdownParserOptions {
  sanitizeHtml?: boolean
}

/**
 * Parse markdown content into sanitized HTML with syntax highlighting
 * @param content - Raw markdown content
 * @param options - Parser options
 * @returns Sanitized HTML string with proper formatting
 */
/**
 * Parse markdown content into sanitized HTML with syntax highlighting
 * @param content - Raw markdown content
 * @param options - Parser options
 * @returns Sanitized HTML string with proper formatting
 */
export async function parseMarkdown(
  content: string, 
  options: MarkdownParserOptions = {}
): Promise<string> {
  const { sanitizeHtml = true } = options

  if (!content) return ''

  try {
    // Parse markdown to HTML
    let html = await marked(content)
    
    // Add code block wrappers for highlighted code with language
    html = html.replace(
      /<pre><code class="hljs language-([^"]+)"([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
      (match, language, attrs, code) => {
        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="language-label">${language}</span>
            <button class="copy-btn" onclick="copyCode(this)" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            </button>
          </div>
          <pre class="code-block-content"><code class="hljs language-${language}"${attrs}>${code}</code></pre>
        </div>`
      }
    )

    // Add wrappers for code blocks without language highlighting
    html = html.replace(
      /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
      (match, attrs, code) => {
        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="language-label">text</span>
            <button class="copy-btn" onclick="copyCode(this)" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            </button>
          </div>
          <pre class="code-block-content"><code${attrs}>${code}</code></pre>
        </div>`
      }
    )
    
    // Sanitize HTML to prevent XSS attacks
    if (sanitizeHtml) {
      html = purify.sanitize(html, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'hr',
          'strong', 'em', 'b', 'i', 'u', 's', 'mark',
          'ul', 'ol', 'li',
          'blockquote',
          'pre', 'code', 'div', 'span', 'button', 'svg', 'rect', 'path',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'a', 'img'
        ],
        ALLOWED_ATTR: [
          'class', 'id', 'style', 
          'href', 'title', 'target', 'rel',
          'src', 'alt', 'width', 'height',
          'align', 'data-*', 'onclick', 'type',
          'viewBox', 'fill', 'stroke', 'stroke-width',
          'd', 'x', 'y', 'rx', 'ry'
        ],
        KEEP_CONTENT: true,
      })
    }
    
    return html
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return `<div class="error-message">Error rendering content</div>`
  }
}

/**
 * Extract text content from markdown (for search, reading time calculation, etc.)
 * @param content - Raw markdown content
 * @returns Plain text content
 */
export function extractTextFromMarkdown(content: string): string {
  if (!content) return ''
  
  try {
    // Remove markdown formatting
    const text = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]*`/g, '') // Remove inline code
      .replace(/#{1,6}\s/g, '') // Remove headings
      .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1') // Remove bold/italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Replace images with alt text
      .replace(/>/g, '') // Remove blockquotes
      .replace(/[-*+]\s/g, '') // Remove list markers
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
    
    return text
  } catch (error) {
    console.error('Error extracting text from markdown:', error)
    return ''
  }
}

/**
 * Count words in markdown content (for reading time calculation)
 * @param content - Raw markdown content
 * @returns Number of words
 */
export function countWordsInMarkdown(content: string): number {
  const text = extractTextFromMarkdown(content)
  if (!text) return 0
  
  return text.split(/\s+/).filter(word => word.length > 0).length
}