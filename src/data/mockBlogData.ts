import { BlogPost } from '@/types'
import { calculateReadingTime } from '@/lib/readingTime'

// Mock Notion blocks for blog post content
export const mockNotionBlocks: Record<string, any[]> = {
  'nextjs-15-modern-web-apps': [
    {
      id: 'block-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'Next.js 15 introduces groundbreaking features that fundamentally change how we build web applications. The App Router brings a new paradigm with Server Components, streaming, and improved data fetching.',
          },
        ],
      },
    },
    {
      id: 'block-2',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ plain_text: 'Server Components Revolution' }],
      },
    },
    {
      id: 'block-3',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'React Server Components allow us to render components on the server, reducing client-side JavaScript and improving performance. This is especially powerful for data-heavy applications.',
          },
        ],
      },
    },
    {
      id: 'block-4',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ plain_text: 'Key Benefits' }],
      },
    },
    {
      id: 'block-5',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Zero client-side JavaScript for server components' }],
      },
    },
    {
      id: 'block-6',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Direct database access without API routes' }],
      },
    },
    {
      id: 'block-7',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Automatic code splitting and lazy loading' }],
      },
    },
    {
      id: 'block-8',
      type: 'code',
      code: {
        rich_text: [
          {
            plain_text: `// Server Component example
async function BlogPost({ id }: { id: string }) {
  const post = await db.post.findUnique({ where: { id } })

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`,
          },
        ],
      },
    },
    {
      id: 'block-9',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ plain_text: 'Improved Data Fetching' }],
      },
    },
    {
      id: 'block-10',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'The new data fetching patterns in Next.js 15 eliminate the need for getServerSideProps and getStaticProps. Instead, we can fetch data directly in our components using async/await.',
          },
        ],
      },
    },
    {
      id: 'block-11',
      type: 'quote',
      quote: {
        rich_text: [
          {
            plain_text: 'The future of web development is server-first, with client interactivity sprinkled where needed.',
          },
        ],
      },
    },
  ],
  'typescript-large-scale-apps': [
    {
      id: 'ts-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'TypeScript has become the de facto standard for building large-scale JavaScript applications. Its static typing system catches errors before runtime and provides excellent developer experience.',
          },
        ],
      },
    },
    {
      id: 'ts-2',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ plain_text: 'Why TypeScript Matters' }],
      },
    },
    {
      id: 'ts-3',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ plain_text: 'Type safety prevents runtime errors' }],
      },
    },
    {
      id: 'ts-4',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ plain_text: 'Better IDE support with autocomplete and refactoring' }],
      },
    },
    {
      id: 'ts-5',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ plain_text: 'Self-documenting code through type annotations' }],
      },
    },
    {
      id: 'ts-6',
      type: 'code',
      code: {
        rich_text: [
          {
            plain_text: `interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`
}`,
          },
        ],
      },
    },
  ],
  'mastering-tailwind-css': [
    {
      id: 'tw-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'Tailwind CSS revolutionizes how we write styles by providing utility classes that compose into complex designs. This approach leads to faster development and more consistent UIs.',
          },
        ],
      },
    },
    {
      id: 'tw-2',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ plain_text: 'Best Practices' }],
      },
    },
    {
      id: 'tw-3',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Use @apply sparingly for reusable components' }],
      },
    },
    {
      id: 'tw-4',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Leverage the config file for custom design tokens' }],
      },
    },
    {
      id: 'tw-5',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ plain_text: 'Use responsive variants for mobile-first design' }],
      },
    },
  ],
  'framer-motion-animations': [
    {
      id: 'fm-1',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            plain_text: 'Framer Motion makes creating animations in React incredibly simple and performant. It provides a declarative API that handles the complexity of animations for you.',
          },
        ],
      },
    },
    {
      id: 'fm-2',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ plain_text: 'Getting Started' }],
      },
    },
    {
      id: 'fm-3',
      type: 'code',
      code: {
        rich_text: [
          {
            plain_text: `import { motion } from 'framer-motion'

function AnimatedBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello, animations!
    </motion.div>
  )
}`,
          },
        ],
      },
    },
  ],
}

// Mock blog posts - reading times calculated dynamically from content
const baseMockBlogPosts = [
  {
    id: 'mock-1',
    title: 'Building Modern Web Applications with Next.js 15',
    slug: 'nextjs-15-modern-web-apps',
    summary: 'Exploring the powerful features of Next.js 15 App Router, Server Components, and how they revolutionize web development.',
    published: '2024-01-15',
    tags: ['Next.js', 'React', 'Web Development', 'TypeScript'],
    featured: true,
  },
  {
    id: 'mock-2',
    title: 'The Power of TypeScript in Large-Scale Applications',
    slug: 'typescript-large-scale-apps',
    summary: 'How TypeScript helps build maintainable, scalable applications with better developer experience and fewer runtime errors.',
    published: '2024-01-08',
    tags: ['TypeScript', 'JavaScript', 'Software Engineering'],
    featured: false,
  },
  {
    id: 'mock-3',
    title: 'Mastering Tailwind CSS: Tips and Best Practices',
    slug: 'mastering-tailwind-css',
    summary: 'Advanced techniques and patterns for building beautiful, responsive UIs with Tailwind CSS utility-first approach.',
    published: '2023-12-20',
    tags: ['CSS', 'Tailwind', 'UI/UX', 'Design'],
    featured: true,
  },
  {
    id: 'mock-4',
    title: 'Introduction to Framer Motion: Animations Made Easy',
    slug: 'framer-motion-animations',
    summary: 'Learn how to create smooth, performant animations in React applications using Framer Motion library.',
    published: '2023-12-10',
    tags: ['React', 'Animations', 'Framer Motion', 'UI/UX'],
    featured: false,
  },
]

// Calculate reading time for each post from its content blocks
export const mockBlogPosts: BlogPost[] = baseMockBlogPosts.map(post => ({
  ...post,
  readingTime: calculateReadingTime(mockNotionBlocks[post.slug] || []),
}))
