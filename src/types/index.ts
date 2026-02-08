// Project types
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image?: string
  tags: string[]
  github?: string
  demo?: string
  featured?: boolean
  year?: string
  isFun?: boolean // For "crazy" or fun side projects
}

// Tech Stack types
export interface TechStack {
  name: string
  category: 'languages' | 'frameworks' | 'cloud' | 'tools' | 'databases' | 'mobile' | 'mlai'
  icon?: string
  yearsOfExperience?: number
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

// Experience types
export interface Experience {
  id: string
  company: string
  role: string
  location: string
  startDate: string // Format: "YYYY-MM"
  endDate?: string // Format: "YYYY-MM" or undefined for current
  description: string
  achievements?: string[]
  technologies?: string[]
}

// Education types
export interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  honors?: string
  description?: string
}

// Blog post types
export interface BlogPost {
  id: string
  title: string | { en: string; es: string }
  slug: string
  summary: string | { en: string; es: string }
  published: string
  tags: string[]
  cover?: string
  featured?: boolean
  readingTime?: number | { en: number; es: number }
  isPublished?: boolean // For internal filtering
  aiAssisted?: boolean // AI assistance indicator
}

export interface BlogPostDetail extends Omit<BlogPost, 'title' | 'summary' | 'readingTime'> {
  title: string | { en: string; es: string }
  summary: string | { en: string; es: string }
  readingTime?: number | { en: number; es: number }
  content: string | { en: string; es: string }
}
