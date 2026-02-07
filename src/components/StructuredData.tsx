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

  let structuredData

  if (type === 'website') {
    structuredData = {
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
    structuredData = {
      ...baseData,
      '@type': 'Person',
      name: siteConfig.author.name,
      email: siteConfig.author.email,
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
    structuredData = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
