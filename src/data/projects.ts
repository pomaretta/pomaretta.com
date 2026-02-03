import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Portfolio v2.0',
    description: 'Complete rebuild from Next.js 11 to 15. Because why not rewrite everything from scratch? 🚀',
    longDescription: 'Rebuilt my entire portfolio from the ground up with Next.js 15, App Router, TypeScript, and Tailwind CSS. Added dark mode, Framer Motion animations, and Notion integration for the blog. Deleted 3 directories of legacy code and started fresh.',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Notion API'],
    github: 'https://github.com/pomaretta/pomaretta.com',
    demo: 'https://carlospomares.es',
    featured: true,
    year: '2025',
    isFun: false,
  },
  {
    id: '2',
    title: 'Termux UI Library',
    description: 'A custom UI library for Java because I thought "How hard can it be?" Spoiler: Pretty hard.',
    longDescription: 'Built during my studies to learn UI design patterns and component architecture. Created custom components from scratch without using existing frameworks. Great learning experience in software design.',
    tags: ['Java', 'UI Design', 'Custom Components'],
    github: 'https://github.com/pomaretta/termux',
    featured: false,
    year: '2021',
    isFun: true,
  },
  // Add your real projects here based on LinkedIn/GitHub
]
