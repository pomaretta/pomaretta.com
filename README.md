# Carlos Pomares Portfolio

Modern portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and file-based blog system.

## ✨ Features

- ⚡ **Next.js 15** with App Router and React Server Components
- 📝 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🌓 **Dark mode** with next-themes
- ✨ **Framer Motion** animations
- **Markdown** blog posts (GitHub Pages style)
- 📱 **Fully responsive** design
- ♿ **Accessible** components
- 🚀 **Optimized** for performance

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/pomaretta/pomaretta.com.git
cd pomaretta.com
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Add Blog Posts

Create markdown files in the `/blog` directory with this format:

```markdown
---
title: "Your Post Title"
date: "2024-02-07"
summary: "Brief description"
tags: ["tag1", "tag2"]
author: "Your Name"
published: true
---

# Your Content

Your markdown content goes here...
```

Filename format: `YYYY-MM-DD-slug.md` (e.g., `2024-02-07-my-first-post.md`)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## 📁 Project Structure

```
src/
├── app/                 # Next.js pages
│   ├── blog/           # Blog pages with Notion integration
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── animations/     # Framer Motion wrappers
│   ├── layout/         # Header, Footer
│   ├── sections/       # Hero, Skills, Projects, Contact
│   ├── ui/            # Reusable UI components
│   └── providers/      # Theme provider
├── lib/
│   ├── blog/           # File-based blog utilities
│   └── utils.ts        # Utility functions
├── types/              # TypeScript definitions
├── data/              # Static data (projects, skills)
└── config/            # Site configuration
```

## 🤖 AI Assistant Documentation

This project includes comprehensive documentation for AI assistants and development tools:

### For GitHub Copilot
**[.copilot-instructions.md](.copilot-instructions.md)**  
Provides code patterns, conventions, and best practices specifically for GitHub Copilot. Includes:
- Component architecture patterns
- TypeScript and styling conventions  
- Development workflow guidelines
- Common code examples and templates

### For Any AI Agent
**[AGENTS.md](AGENTS.md)**  
Comprehensive guide for all AI assistants working with this repository. Contains:
- Complete project architecture overview
- Development guidelines and best practices
- Troubleshooting and testing procedures
- Performance and security considerations

### Migration Information
**[AI_MIGRATION.md](AI_MIGRATION.md)**  
Documents the migration from Claude-specific to universal AI documentation formats.

These files ensure optimal collaboration between developers and AI tools while maintaining code quality and consistency.

## 🎨 Customization

### Update Site Info

Edit [src/config/site.ts](src/config/site.ts):

```typescript
export const siteConfig = {
  name: "Your Name",
  url: "https://yoursite.com",
  description: "Your description",
  // ...
}
```

### Add Projects

Edit [src/data/projects.ts](src/data/projects.ts) to add your projects.

### Add Skills

Edit [src/data/skills.ts](src/data/skills.ts) to update your skills.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:

```bash
npm run build
npm run start
```

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

---

Built with ❤️ by [Carlos Pomares](https://carlospomares.es)