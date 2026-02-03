# Carlos Pomares Portfolio

Modern portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Notion integration.

## ✨ Features

- ⚡ **Next.js 15** with App Router and React Server Components
- 📝 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🌓 **Dark mode** with next-themes
- ✨ **Framer Motion** animations
- 📚 **Notion API** integration for blog posts
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

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Fill in your Notion credentials:

```env
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DATABASE_ID=your_notion_database_id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Carlos Pomares
```

### 3. Notion Database Setup

1. Create a database in Notion called "Blog Posts"
2. Add these properties:
   - **Title** (Title)
   - **Slug** (Text) - URL-friendly identifier
   - **Summary** (Text) - Short description
   - **Published** (Date)
   - **Status** (Select: Draft, Published)
   - **Tags** (Multi-select)
   - **Cover** (Files & Media)
3. Create an integration at [notion.so/my-integrations](https://notion.so/my-integrations)
4. Share your database with the integration
5. Copy the integration token and database ID to `.env.local`

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
│   ├── notion/         # Notion API integration
│   └── utils.ts        # Utility functions
├── types/              # TypeScript definitions
├── data/              # Static data (projects, skills)
└── config/            # Site configuration
```

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