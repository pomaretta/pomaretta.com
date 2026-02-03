# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern portfolio website for Carlos Pomares built with Next.js 15, TypeScript, Tailwind CSS, and Notion integration for blog posts. Features dark mode, smooth animations, and a fully responsive design.

## Technology Stack

- **Next.js 15** with App Router and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark mode support
- **Framer Motion** for animations
- **Notion API** for blog content management
- **next-themes** for dark mode toggle

## Development Commands

```bash
npm install           # Install dependencies
npm run dev           # Start development server (localhost:3000)
npm run build         # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Project Structure

```
.
├── .github/                  # GitHub configuration
│   ├── workflows/           # GitHub Actions workflows
│   │   ├── ci.yml          # CI validation pipeline
│   │   └── labeler.yml     # Auto-label PRs
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml      # Automated dependency updates
│   └── labeler.yml         # PR labeler configuration
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout with providers
│   │   ├── page.tsx       # Home page with all sections
│   │   └── blog/          # Blog pages with Notion integration
│   │       ├── page.tsx   # Blog list (ISR: 60s)
│   │       └── [slug]/
│   │           └── page.tsx # Individual post page (ISR: 60s)
│   ├── components/
│   │   ├── animations/    # Framer Motion wrappers (FadeIn, SlideIn, ScaleIn)
│   │   ├── layout/       # Header with nav, Footer
│   │   ├── sections/     # Hero, Skills, Projects, Contact
│   │   ├── ui/           # Reusable components (Button, Card, Badge, ThemeToggle)
│   │   └── providers/    # ThemeProvider for dark mode
│   ├── lib/
│   │   ├── i18n/         # Internationalization
│   │   │   ├── LanguageContext.tsx  # Language provider
│   │   │   └── translations.ts      # English/Spanish translations
│   │   ├── notion/       # Notion API integration
│   │   │   ├── client.ts # Notion client setup
│   │   │   ├── queries.ts # Database queries
│   │   │   └── parser.tsx # Block parser for rendering
│   │   ├── utils.ts      # Utility functions (cn for classnames)
│   │   └── readingTime.ts # Calculate blog reading time
│   ├── types/            # TypeScript definitions
│   │   └── index.ts     # Project, Skill, BlogPost, Experience types
│   ├── data/            # Static data
│   │   ├── projects.ts  # Project showcase data
│   │   ├── techstack-new.ts # Tech stack with categories
│   │   ├── experience.ts # Work experience data
│   │   ├── socials.ts   # Social media links
│   │   └── mockBlogData.ts # Mock blog posts (fallback)
│   └── config/
│       └── site.ts      # Site metadata and configuration
├── CLAUDE.md            # This file - Claude Code guidance
├── CONTRIBUTING.md      # Contribution guidelines
├── README.md            # Project documentation
└── LICENSE              # MIT License
```

## Architecture Decisions

### App Router (Next.js 15)
- **Server Components by default**: Most components are server components for better performance
- **Client Components**: Only when needed (animations, interactive elements, theme toggle)
- **ISR**: Blog pages use Incremental Static Regeneration with 60-second revalidation
- **generateStaticParams**: Blog posts are statically generated at build time

### Styling System
- **Tailwind CSS** with semantic color tokens (background, foreground, primary, etc.)
- **Dark mode**: Class-based strategy with `next-themes`
- **CSS variables**: HSL color values defined in [src/app/globals.css](src/app/globals.css:1)
- **Utility function**: `cn()` combines clsx and tailwind-merge for classnames

### Component Patterns
1. **UI Components** ([src/components/ui/](src/components/ui/)): Reusable primitives with variants
   - Use `class-variance-authority` for variant management
   - Example: [Button.tsx](src/components/ui/Button.tsx:1) has size and variant props

2. **Section Components** ([src/components/sections/](src/components/sections/)): Page sections
   - Composed of UI components and animations
   - Example: [Hero.tsx](src/components/sections/Hero.tsx:1) uses FadeIn animations

3. **Animation Components** ([src/components/animations/](src/components/animations/)): Framer Motion wrappers
   - Scroll-triggered animations with `useInView`
   - Consistent easing and timing

### Notion Integration
- **Blog posts** fetched from Notion database with these properties:
  - Title (Title)
  - Slug (Text) - URL identifier
  - Summary (Text) - Short description
  - Published (Date)
  - Status (Select: Draft/Published)
  - Tags (Multi-select)
  - Cover (Files & Media)

- **Queries** ([src/lib/notion/queries.ts](src/lib/notion/queries.ts:1)):
  - `getBlogPosts()` - Fetches all published posts
  - `getBlogPostBySlug(slug)` - Fetches single post with content blocks
  - Falls back to mock data when Notion is not configured

- **Parser** ([src/lib/notion/parser.tsx](src/lib/notion/parser.tsx:1)):
  - Converts Notion blocks to React components
  - Supports paragraphs, headings, lists, code, quotes
  - Groups consecutive list items properly

- **Reading Time** ([src/lib/readingTime.ts](src/lib/readingTime.ts:1)):
  - Calculates reading time dynamically from blog content
  - 225 words per minute average
  - Code blocks weighted 1.5x (takes longer to read)

### Internationalization (i18n)
- **Supported Languages**: English (en), Spanish (es)
- **Context Provider**: ([src/lib/i18n/LanguageContext.tsx](src/lib/i18n/LanguageContext.tsx:1))
  - Uses React Context for language state
  - Persists language preference in localStorage
  - Provides `t` (translations) and `locale` to components
- **Translations**: ([src/lib/i18n/translations.ts](src/lib/i18n/translations.ts:1))
  - All UI strings defined in translation objects
  - Navigation, hero, sections, blog, contact, etc.
  - Language toggle in header switches between en/es

## Environment Variables

Required in `.env.local`:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_notion_database_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Carlos Pomares
```

**Note**: The application works without Notion credentials by using mock blog data.

## CI/CD & GitHub Workflows

### Continuous Integration ([.github/workflows/ci.yml](.github/workflows/ci.yml:1))

Runs on every push to `main` and all pull requests:

1. **ESLint**: `npm run lint` - Checks code quality and style
2. **Type Check**: `npm run type-check` - Validates TypeScript types
3. **Build**: `npm run build` - Ensures production build succeeds
4. **Artifacts Check**: Verifies `.next` directory was created

**Environment**: Ubuntu latest with Node.js 20.x and npm caching for speed.

### PR Auto-Labeler ([.github/workflows/labeler.yml](.github/workflows/labeler.yml:1))

Automatically adds labels to pull requests based on changed files:
- `documentation` - Changes to *.md files
- `components` - Changes in src/components/
- `ui` - Changes in src/components/ui/
- `blog` - Changes to blog or Notion integration
- `styling` - Changes to CSS or Tailwind config
- `types` - Changes to TypeScript definitions
- `data` - Changes to static data files
- `config` - Changes to configuration files
- `dependencies` - Changes to package.json
- `ci-cd` - Changes to .github/
- `i18n` - Changes to internationalization

Configuration: [.github/labeler.yml](.github/labeler.yml:1)

### Dependabot ([.github/dependabot.yml](.github/dependabot.yml:1))

Automated weekly dependency updates:
- **npm packages**: Mondays at 09:00
- **GitHub Actions**: Mondays at 09:00
- Opens up to 10 PRs per cycle
- Auto-labels with `dependencies` and `automated`
- Assigns to @pomaretta for review

### Issue Templates

- **Bug Report** ([.github/ISSUE_TEMPLATE/bug_report.yml](.github/ISSUE_TEMPLATE/bug_report.yml:1))
  - Structured form with description, steps to reproduce, expected/actual behavior
  - Browser, OS, device type fields
  - Screenshot upload support

- **Feature Request** ([.github/ISSUE_TEMPLATE/feature_request.yml](.github/ISSUE_TEMPLATE/feature_request.yml:1))
  - Problem statement, proposed solution, alternatives
  - Priority levels, use cases, examples

- **Config** ([.github/ISSUE_TEMPLATE/config.yml](.github/ISSUE_TEMPLATE/config.yml:1))
  - Links to GitHub Discussions and documentation

### Pull Request Template ([.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md:1))

Comprehensive checklist including:
- Description and type of change
- Related issues
- Testing checklist (dev, build, lint, type-check, browsers, mobile, dark mode)
- Code review checklist
- Documentation updates

## Common Tasks

### Adding a New Project
Edit [src/data/projects.ts](src/data/projects.ts:1) and add to the `projects` array.

### Adding a New Skill
Edit [src/data/skills.ts](src/data/skills.ts:1) and add to the `skills` array.

### Updating Site Metadata
Edit [src/config/site.ts](src/config/site.ts:1) for name, description, links, etc.

### Creating a New Section
1. Create component in [src/components/sections/](src/components/sections/)
2. Import and use animation components (FadeIn, SlideIn)
3. Add to [src/app/page.tsx](src/app/page.tsx:1)

### Modifying the Blog Parser
Edit [src/lib/notion/parser.tsx](src/lib/notion/parser.tsx:1) to support additional Notion block types.

## Important Notes

- **TypeScript**: Strict mode enabled. All components use proper typing.
- **Dark Mode**: Theme provider wraps app in [layout.tsx](src/app/layout.tsx:1). ThemeToggle in Header.
- **Animations**: Client components only. Use `'use client'` directive.
- **ISR**: Blog pages revalidate every 60 seconds. Modify `revalidate` export to change.
- **Notion SDK**: Uses `any` type casting for `notion.databases.query()` due to SDK type limitations.

## Deployment

Recommended: **Vercel**

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NOTION_API_KEY`
   - `NOTION_BLOG_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_NAME`
4. Deploy

The build output shows:
- Static pages: `/`, `/_not-found`
- ISR pages: `/blog` (60s revalidation)
- SSG pages: `/blog/[slug]` (generated at build time)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md:1) for detailed guidelines including:
- Fork and clone workflow
- Branch naming conventions
- Commit message format (feat:, fix:, docs:, etc.)
- Code style and TypeScript guidelines
- Testing requirements before PR submission
- PR description templates

**Quick Start for Contributors**:
1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test: `npm run lint && npm run type-check && npm run build`
4. Commit with conventional format: `git commit -m "feat: add new feature"`
5. Push and create a pull request

## Recent Changes

### Version 2.0 - Complete Rebuild
The project was completely rebuilt from scratch:
- Migrated from Next.js 11 (Pages Router) to Next.js 15 (App Router)
- Replaced JavaScript with TypeScript
- Replaced SCSS with Tailwind CSS
- Removed separate Express API backend
- Added Notion integration for blog with ISR
- Implemented dark mode with next-themes
- Replaced GSAP with Framer Motion
- Modern component architecture with proper separation of concerns

### Repository Organization
- Added comprehensive GitHub Actions CI/CD pipeline
- Automated PR labeling based on changed files
- Dependabot for automated dependency updates
- Issue templates for bug reports and feature requests
- Pull request template with comprehensive checklist
- Contributing guidelines for open-source collaboration
- MIT License added

### Internationalization
- Added English/Spanish language support
- Language toggle in navigation
- Persistent language preference in localStorage
- All UI strings externalized to translation files

### Blog Enhancements
- Dynamic reading time calculation (225 WPM)
- Mock data fallback when Notion is not configured
- Improved Notion block parser with list grouping
- Reading time display on blog list and post pages

## Known Issues & Considerations

- **ESLint Warnings**: Using `<img>` instead of Next.js `<Image>` component in some places (intentional for external content)
- **Notion Fallback**: Application works without Notion credentials using mock data
- **i18n**: Currently supports English and Spanish; easy to add more languages by extending translations.ts
- **Dark Mode**: Uses `next-themes` with class-based strategy; requires client-side mounting check to avoid hydration errors
- **Blog Feature**: Currently disabled on homepage but fully functional at `/blog` route

## Re-enabling Blog Feature

The blog feature is currently disabled from the homepage but all code, routes, and functionality remain intact.

### What's Disabled
- Blog preview section on homepage
- Blog navigation link in header

### To Re-enable

**1. Homepage Section** ([src/app/page.tsx](src/app/page.tsx:7))
```typescript
// Uncomment the import
import { BlogPreview } from '@/components/sections/BlogPreview'

// Uncomment in the JSX (around line 22)
<BlogPreview />
```

**2. Navigation Link** ([src/components/layout/Navigation.tsx](src/components/layout/Navigation.tsx:78))
```typescript
// Uncomment this line (around line 78)
<NavLink sectionId="blog">{t.nav.blog}</NavLink>
```

### What Still Works
- Blog routes: `/blog` and `/blog/[slug]`
- Notion integration (with fallback to mock data)
- All blog components and utilities
- Reading time calculation
- Blog post rendering

## Best Practices for Development

### When Adding New Features
1. **Check existing patterns**: Review similar components before creating new ones
2. **Use TypeScript strictly**: No `any` types unless absolutely necessary (Notion SDK exception)
3. **Test all states**:
   - Light and dark mode
   - English and Spanish translations
   - Desktop and mobile viewports
4. **Run validation**: Always run `npm run lint && npm run type-check && npm run build` before committing
5. **Update documentation**: If you change architecture or add major features, update this file

### Component Development
- **Server Components first**: Default to server components; only use `'use client'` when needed
- **Animations**: Wrap in client components with proper `useInView` hooks
- **Styling**: Use Tailwind utility classes; avoid custom CSS unless necessary
- **Accessibility**: Include proper ARIA labels, keyboard navigation, semantic HTML
- **Responsive**: Mobile-first approach with Tailwind breakpoints (sm, md, lg, xl)

### Data Management
- **Static data**: Use files in `src/data/` for projects, skills, experience
- **Blog content**: Prefer Notion integration; mock data is fallback only
- **Translations**: Add new strings to `src/lib/i18n/translations.ts` for both en and es
- **Types**: Define all data structures in `src/types/index.ts`

### Testing Before PR
```bash
# Full validation suite
npm run lint           # ESLint checks
npm run type-check     # TypeScript validation
npm run build          # Production build
npm run dev            # Manual testing in dev mode

# Test checklist
# [ ] All pages render without errors
# [ ] Dark mode works correctly
# [ ] Language switching works
# [ ] Mobile responsive (Chrome DevTools)
# [ ] Blog posts display correctly
# [ ] Navigation works on all pages
# [ ] No console errors or warnings (check browser console)
```

### Git Workflow
```bash
# Always work on feature branches
git checkout -b feature/your-feature-name

# Commit with conventional commits
git commit -m "feat: add user authentication"
git commit -m "fix: resolve navigation bug on mobile"
git commit -m "docs: update CLAUDE.md with new section"
git commit -m "style: format code with prettier"
git commit -m "refactor: simplify blog parser logic"

# Push and create PR
git push origin feature/your-feature-name
# Then create PR on GitHub - CI will automatically run
```

## Debugging Common Issues

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Check for missing dependencies: `npm install`
- Verify environment variables are set (`.env.local`)
- Clear `.next` folder: `rm -rf .next && npm run build`

### Hydration Errors
- Usually caused by server/client mismatch
- Check theme-dependent code (needs `mounted` state check)
- Verify no direct `window` or `document` access in server components

### Notion Integration Not Working
- Verify `NOTION_API_KEY` and `NOTION_BLOG_DATABASE_ID` in `.env.local`
- Check Notion database is shared with integration
- Application will fall back to mock data automatically

### Dark Mode Issues
- Ensure `ThemeProvider` is in root layout
- Use `next-themes` `useTheme` hook in client components
- Add `mounted` check to prevent hydration mismatches
- Verify Tailwind config has `darkMode: 'class'`

### Internationalization Issues
- Check `LanguageContext` is wrapping the app
- Verify translation keys exist in both `en` and `es` objects
- Use `useLanguage` hook to access `t` (translations) and `locale`

## Performance Optimization

- **Server Components**: Most components are server-rendered (no JS sent to client)
- **ISR**: Blog pages regenerate every 60 seconds (balance freshness vs. performance)
- **Code Splitting**: Next.js automatically splits code by route
- **Image Optimization**: Use Next.js `<Image>` component for user-uploaded content
- **Bundle Analysis**: Run `ANALYZE=true npm run build` to analyze bundle size

## Security Considerations

- **Environment Variables**: Never commit `.env.local` (already in `.gitignore`)
- **API Keys**: Notion API key is server-only (never exposed to client)
- **Dependencies**: Dependabot automatically updates and checks for vulnerabilities
- **HTTPS**: Always use HTTPS in production (handled by Vercel automatically)
- **Content Validation**: Notion content is sanitized during parsing
