import { siteConfig } from '@/config/site'

interface StructuredDataProps {
  type?: 'website' | 'person' | 'article'
  title?: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: string
}

export function StructuredData({
  type = 'website',
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: StructuredDataProps) {
  const baseData = {
    '@context': 'https://schema.org',
  }

  const structuredData = (() => {
    if (type === 'website') {
      return {
      ...baseData,
      '@type': 'WebSite',
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      author: {
        '@type': 'Person',
        name: siteConfig.author.name,
        url: siteConfig.url,
        sameAs: [
          siteConfig.links.github,
          siteConfig.links.linkedin,
          siteConfig.links.twitter,
        ],
        jobTitle: 'Data & AI Engineer',
        worksFor: {
          '@type': 'Organization',
          name: 'Independent',
        },
      },
      inLanguage: ['en-US', 'es-ES'],
    }
  } else if (type === 'person') {
    return {
      ...baseData,
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
      image: image || `${siteConfig.url}/og-image.png`,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        siteConfig.links.twitter,
      ],
      jobTitle: 'Data & AI Engineer',
      description: siteConfig.description,
      worksFor: {
        '@type': 'Organization',
        name: 'Independent',
      },
      knowsAbout: [
        'Data Engineering',
        'Artificial Intelligence',
        'Machine Learning',
        'Software Development',
        'Python',
        'TypeScript',
        'React',
        'Next.js',
        'MLOps',
        'Cloud Computing',
      ],
    }
  } else if (type === 'article') {
    return {
      ...baseData,
      '@type': 'BlogPosting',
      headline: title || siteConfig.name,
      description: description || siteConfig.description,
      image: image || `${siteConfig.url}/og-image.png`,
      ...(datePublished && { datePublished }),
      ...((dateModified || datePublished) && {
        dateModified: dateModified || datePublished,
      }),
      author: {
        '@type': 'Person',
        name: author || siteConfig.author.name,
        url: siteConfig.url,
      },
      publisher: {
        '@type': 'Person',
        name: siteConfig.author.name,
        url: siteConfig.url,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteConfig.url,
      },
    }
  } else {
    return null
  }
})()

  if (!structuredData) {
    return null
  }

  // Escape dangerous characters to prevent script injection
  const jsonLd = JSON.stringify(structuredData)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  )
}
