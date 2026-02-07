import { siteConfig } from '@/config/site'

type StructuredDataProps = 
  | {
      type?: 'website'
    }
  | {
      type: 'person'
      image?: string
    }
  | {
      type: 'article'
      title?: string
      description?: string
      image?: string
      datePublished?: string
      dateModified?: string
      author?: string
    }

// Utility function to generate structured data object
export function generateStructuredData(props: StructuredDataProps) {
  const { type = 'website' } = props
  const baseData = {
    '@context': 'https://schema.org',
  }

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
    const { image } = props as Extract<StructuredDataProps, { type: 'person' }>
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
    const { title, description, image, datePublished, dateModified, author } = 
      props as Extract<StructuredDataProps, { type: 'article' }>
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
}

export function StructuredData(props: StructuredDataProps) {
  const structuredData = generateStructuredData(props)

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
