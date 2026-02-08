import type { Locale } from '@/lib/i18n/translations'

/**
 * Get localized content from a string or localized object
 */
export function getLocalizedContent(
  content: string | { en: string; es: string },
  locale: Locale
): string {
  if (typeof content === 'string') {
    return content
  }
  return content[locale] || content.en || content.es || ''
}

/**
 * Get localized number from a number or localized object
 */
export function getLocalizedNumber(
  value: number | { en: number; es: number } | undefined,
  locale: Locale
): number | undefined {
  if (typeof value === 'number') {
    return value
  }
  if (!value) {
    return undefined
  }
  return value[locale] || value.en || value.es
}

/**
 * Parse content with language separators
 * Format: <!-- EN -->...content...<!-- ES -->...content...
 */
export function parseMultiLanguageContent(content: string): { en: string; es: string } {
  const enMatch = content.match(/<!-- EN -->([\s\S]*?)(?=<!-- ES -->|$)/i)
  const esMatch = content.match(/<!-- ES -->([\s\S]*?)$/i)

  return {
    en: enMatch ? enMatch[1].trim() : content,
    es: esMatch ? esMatch[1].trim() : content
  }
}

/**
 * Check if content has multiple languages
 */
export function hasMultiLanguageContent(content: string): boolean {
  return /<!-- EN -->[\s\S]*<!-- ES -->/.test(content)
}