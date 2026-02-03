import { TechStack } from '@/types'

export const techStack: TechStack[] = [
  // Languages
  {
    name: 'JavaScript',
    category: 'languages',
    yearsOfExperience: 4,
    proficiency: 'expert',
  },
  {
    name: 'TypeScript',
    category: 'languages',
    yearsOfExperience: 3,
    proficiency: 'advanced',
  },
  {
    name: 'Go',
    category: 'languages',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
  {
    name: 'Java',
    category: 'languages',
    yearsOfExperience: 3,
    proficiency: 'advanced',
  },
  {
    name: 'PHP',
    category: 'languages',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },
  {
    name: 'Python',
    category: 'languages',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },

  // Frameworks & Libraries
  {
    name: 'React',
    category: 'frameworks',
    yearsOfExperience: 3,
    proficiency: 'expert',
  },
  {
    name: 'Next.js',
    category: 'frameworks',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
  {
    name: 'Tailwind CSS',
    category: 'frameworks',
    yearsOfExperience: 2,
    proficiency: 'expert',
  },
  {
    name: 'Node.js',
    category: 'frameworks',
    yearsOfExperience: 3,
    proficiency: 'advanced',
  },
  {
    name: 'Express',
    category: 'frameworks',
    yearsOfExperience: 3,
    proficiency: 'advanced',
  },

  // Mobile
  {
    name: 'Android',
    category: 'mobile',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },
  {
    name: 'Android Studio',
    category: 'mobile',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },

  // Cloud & Infrastructure
  {
    name: 'AWS',
    category: 'cloud',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },
  {
    name: 'Docker',
    category: 'cloud',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
  {
    name: 'Kubernetes',
    category: 'cloud',
    yearsOfExperience: 1,
    proficiency: 'intermediate',
  },

  // Databases
  {
    name: 'MySQL',
    category: 'databases',
    yearsOfExperience: 3,
    proficiency: 'advanced',
  },
  {
    name: 'PostgreSQL',
    category: 'databases',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },
  {
    name: 'MongoDB',
    category: 'databases',
    yearsOfExperience: 2,
    proficiency: 'intermediate',
  },
  {
    name: 'Redis',
    category: 'databases',
    yearsOfExperience: 1,
    proficiency: 'intermediate',
  },

  // Tools & Others
  {
    name: 'Git',
    category: 'tools',
    yearsOfExperience: 4,
    proficiency: 'expert',
  },
  {
    name: 'GitHub Actions',
    category: 'tools',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
  {
    name: 'JWT',
    category: 'tools',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
  {
    name: 'WebSockets',
    category: 'tools',
    yearsOfExperience: 2,
    proficiency: 'advanced',
  },
]

// Group tech stack by category for easier rendering
export const groupedTechStack = techStack.reduce((acc, tech) => {
  if (!acc[tech.category]) {
    acc[tech.category] = []
  }
  acc[tech.category].push(tech)
  return acc
}, {} as Record<string, TechStack[]>)
