# AI Agents Guide

This file provides guidance for AI agents and automated tools working with this repository.

## Project Summary

**Carlos Pomares Portfolio Website**  
Modern, responsive portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Features dark mode, internationalization (English/Spanish), file-based blog system (GitHub Pages style), and smooth scroll animations.

**Architecture**: Server-first with selective client components for interactivity and animations.

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with App Router | 15.x |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Utility-first styling | 3.x |
| Framer Motion | Animations | 11.x |
| Markdown | Blog content format (GitHub Pages style) | - |
| gray-matter | Front matter parsing | Latest |
| next-themes | Dark mode support | Latest |

## Project Structure

```
blog/                       # Blog posts (markdown files)
├── 2024-01-15-first-post.md
├── 2024-02-01-second-post.md  
└── ...
src/
├── app/                    # Next.js pages (App Router)
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage with all sections
│   └── blog/              # Blog routes with markdown processing
├── components/
│   ├── animations/        # Framer Motion wrappers
│   ├── layout/           # Header, Navigation, Footer
│   ├── sections/         # Homepage sections (Hero, Projects, etc.)
│   ├── ui/               # Reusable UI components
│   └── providers/        # React Context providers
├── lib/
│   ├── i18n/             # Internationalization (en/es)
│   ├── blog/             # File-based blog utilities
│   └── utils.ts          # Shared utilities
├── data/                 # Static data (projects, experience, skills)
├── types/                # TypeScript definitions
└── config/               # Site configuration
```

## Architecture Principles

### Component Hierarchy
1. **Server Components (Default)**: Most components render on server for performance
2. **Client Components**: Only for interactivity, animations, and browser APIs
3. **UI Primitives**: Reusable components with variant-based styling
4. **Section Components**: Composed page sections with animations
5. **Layout Components**: App-wide structure (header, navigation, footer)

### Data Flow
1. **Static Data**: TypeScript files in `/data` directory
2. **Blog Content**: Markdown files in `/blog` directory with ISR (60s revalidation)
3. **User Preferences**: localStorage for theme and language persistence
4. **Internationalization**: Context-based with translation objects

### Styling System
- **Design System**: Semantic color tokens (background, foreground, primary, etc.)
- **Dark Mode**: Class-based strategy with CSS variables
- **Responsive**: Mobile-first with Tailwind breakpoints
- **Animations**: Scroll-triggered with Framer Motion

## Development Guidelines

### Code Organization Rules

```typescript
// File naming conventions
ComponentName.tsx          // React components (PascalCase)
utils.ts                   // Utility functions
types/index.ts            // TypeScript definitions
data/projects.ts          // Static data exports
```

### Component Patterns

#### Server Component (Default)
```typescript
// No 'use client' directive needed
export async function ServerComponent() {
  // Can access databases, file system, etc.
  const data = await fetchData()
  return <div>{data.title}</div>
}
```

#### Client Component (Selective)
```typescript
'use client'
import { useState, useEffect } from 'react'

export function ClientComponent() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null // Prevent hydration errors
  
  return <div>Interactive content</div>
}
```

#### Animation Component
```typescript
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

#### UI Component with Variants
```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Data Management Patterns

#### Static Data Export
```typescript
// src/data/projects.ts
export const projects: Project[] = [
  {
    id: 1,
    title: "Project Name",
    description: "Description",
    technologies: ["Next.js", "TypeScript"],
    githubUrl: "https://github.com/user/repo",
    liveUrl: "https://example.com",
    image: "/images/project.jpg",
    featured: true
  }
]
```

#### File-based Blog Integration
```typescript
// src/lib/blog/queries.ts
export async function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'blog')
  const filenames = fs.readdirSync(postsDirectory)
  
  const posts = filenames
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const filePath = path.join(postsDirectory, name)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug: name.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
        summary: data.summary,
        tags: data.tags || [],
        content
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
  return posts
}
```

#### Internationalization Usage
```typescript
// src/components/sections/Hero.tsx
import { useLanguage } from '@/lib/i18n/LanguageContext'

export function Hero() {
  const { t, locale } = useLanguage()
  
  return (
    <section>
      <h1>{t.hero.title}</h1>
      <p>{t.hero.subtitle}</p>
    </section>
  )
}
```

### Styling Guidelines

#### Semantic Color Usage
```css
/* Use semantic tokens instead of specific colors */
.bg-background .text-foreground          /* Page background */
.bg-card .text-card-foreground          /* Card containers */
.bg-primary .text-primary-foreground    /* Primary actions */
.bg-muted .text-muted-foreground        /* Secondary content */
```

#### Responsive Design Patterns
```typescript
// Mobile-first responsive classes
className="text-sm md:text-base lg:text-lg"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="px-4 md:px-6 lg:px-8"
```

#### Conditional Styling
```typescript
import { cn } from '@/lib/utils'

const className = cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "primary-classes",
  {
    "active-classes": isActive,
    "disabled-classes": isDisabled
  }
)
```

## Common Tasks for AI Agents

### Adding a New Section Component

1. **Create component file**: `src/components/sections/NewSection.tsx`
2. **Use animation wrapper**: Import and wrap content with motion
3. **Add translations**: Update `src/lib/i18n/translations.ts`
4. **Add to homepage**: Import and render in `src/app/page.tsx`
5. **Type definitions**: Add any new types to `src/types/index.ts`

### Updating Site Content

**Projects**: Edit `src/data/projects.ts`  
**Work Experience**: Edit `src/data/experience.ts`  
**Tech Stack**: Edit `src/data/techstack-new.ts`  
**Social Links**: Edit `src/data/socials.ts`  
**Site Metadata**: Edit `src/config/site.ts`

### Adding New Translations

```typescript
// src/lib/i18n/translations.ts
export const translations = {
  en: {
    newSection: {
      title: "New Section Title",
      description: "Section description"
    }
  },
  es: {
    newSection: {
      title: "Título de Nueva Sección", 
      description: "Descripción de sección"
    }
  }
}
```

### Modifying Blog Integration

**Blog Posts**: `/blog/*.md` - Markdown files with front matter  
**Parser**: `src/lib/blog/parser.ts` - Markdown and front matter parsing  
**Queries**: `src/lib/blog/queries.ts` - File system reading utilities  
**Types**: `src/types/index.ts` - BlogPost interface  

### Blog Post Format

```markdown
---
title: "My Blog Post Title"
date: "2024-02-07"
summary: "A brief description of the post"
tags: ["next.js", "typescript", "web-development"]
author: "Carlos Pomares"
published: true
---

# Post Content

Your markdown content goes here...
```

### Styling Modifications

**Theme Colors**: `src/app/globals.css` - CSS variables  
**Tailwind Config**: `tailwind.config.ts` - Custom utilities  
**Component Variants**: Individual component files using `cva`

## Testing & Validation

### Automated Checks
```bash
npm run lint           # ESLint code quality
npm run type-check     # TypeScript validation
npm run build          # Production build test
```

### Manual Testing Checklist
- [ ] Light/dark mode toggle functionality
- [ ] English/Spanish language switching
- [ ] Mobile responsiveness (Chrome DevTools)
- [ ] Scroll animations trigger correctly
- [ ] Blog pages render correctly from markdown files
- [ ] No console errors in browser dev tools
- [ ] All interactive elements accessible via keyboard
- [ ] All images have proper alt text

### Environment Setup
```env
# Required in .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # Site URL
NEXT_PUBLIC_SITE_NAME=Carlos Pomares         # Site name
```

**Note**: No external API credentials needed - blog posts are read from the file system.

### Build & Deployment

**Development**: `npm run dev` (localhost:3000)  
**Production Build**: `npm run build && npm start`  
**Deployment Target**: Vercel (automatic from GitHub)

**Build Output**:
- Static pages: `/`, `/_not-found`
- ISR pages: `/blog` (60s revalidation)
- SSG pages: `/blog/[slug]` (generated at build time)

## Performance Considerations

- **Server Components**: Minimize client-side JavaScript
- **Image Optimization**: Use Next.js `<Image>` component
- **ISR Strategy**: Blog pages revalidate every 60 seconds 
- **Code Splitting**: Automatic route-based splitting
- **Animation Optimization**: Use `will-change` and GPU acceleration
- **Bundle Analysis**: `ANALYZE=true npm run build` for size analysis

## Security & Best Practices

- **Environment Variables**: Only public site configuration needed
- **File System**: Blog content served statically from `/blog` directory  
- **Content Sanitization**: Markdown content parsed safely
- **Dependency Updates**: Automated via Dependabot
- **HTTPS**: Enforced in production (Vercel)
- **TypeScript Strict Mode**: Enabled for type safety

## Known Limitations

1. **Blog Feature**: Currently disabled on homepage (code exists, can be re-enabled)
2. **File System**: Blog posts must be manually added to `/blog` directory
3. **Image Optimization**: Some external images use `<img>` instead of `<Image>`
4. **Language Support**: Currently English/Spanish (extensible)
5. **Dark Mode**: Requires client-side mounting check for SSR compatibility

## Troubleshooting Common Issues

**Hydration Errors**: Check for server/client mismatches, usually theme-related  
**Build Failures**: Run type-check, verify environment variables  
**Animation Issues**: Ensure Framer Motion components are client-side  
**Blog Errors**: Verify markdown files exist in `/blog` directory with proper front matter  
**Dark Mode Problems**: Check ThemeProvider setup and mounted state  
**Translation Missing**: Verify keys exist in both `en` and `es` objects