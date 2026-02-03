import { TechStack } from '@/types'

export const techStackNew: TechStack[] = [
  // Languages
  { name: 'Python', category: 'languages', yearsOfExperience: 4, proficiency: 'expert' },
  { name: 'Golang', category: 'languages', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'SQL', category: 'languages', yearsOfExperience: 4, proficiency: 'advanced' },

  // Cloud & Infrastructure
  { name: 'AWS Lambda', category: 'cloud', yearsOfExperience: 3, proficiency: 'expert' },
  { name: 'ECS Fargate', category: 'cloud', yearsOfExperience: 3, proficiency: 'expert' },
  { name: 'Step Functions', category: 'cloud', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'AWS CDK', category: 'cloud', yearsOfExperience: 3, proficiency: 'expert' },
  { name: 'CloudFormation', category: 'cloud', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'CodePipeline', category: 'cloud', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'CodeBuild', category: 'cloud', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'SQS', category: 'cloud', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'CloudWatch', category: 'cloud', yearsOfExperience: 4, proficiency: 'advanced' },
  { name: 'Docker', category: 'cloud', yearsOfExperience: 4, proficiency: 'expert' },

  // Databases & Storage
  { name: 'PostgreSQL', category: 'databases', yearsOfExperience: 4, proficiency: 'expert' },
  { name: 'OpenSearch', category: 'databases', yearsOfExperience: 2, proficiency: 'advanced' },
  { name: 'Athena', category: 'databases', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'S3', category: 'databases', yearsOfExperience: 4, proficiency: 'expert' },

  // ML & AI
  { name: 'TensorFlow', category: 'mlai', yearsOfExperience: 2, proficiency: 'intermediate' },
  { name: 'PyTorch', category: 'mlai', yearsOfExperience: 2, proficiency: 'intermediate' },
  { name: 'SpaCy', category: 'mlai', yearsOfExperience: 1, proficiency: 'advanced' },
  { name: 'LLMs', category: 'mlai', yearsOfExperience: 2, proficiency: 'advanced' },
  { name: 'AWS Bedrock', category: 'mlai', yearsOfExperience: 2, proficiency: 'advanced' },
  { name: 'Claude (Anthropic)', category: 'mlai', yearsOfExperience: 2, proficiency: 'expert' },
  { name: 'AWS Titan', category: 'mlai', yearsOfExperience: 2, proficiency: 'advanced' },

  // Tools & Platforms
  { name: 'Git', category: 'tools', yearsOfExperience: 5, proficiency: 'expert' },
  { name: 'Grafana', category: 'tools', yearsOfExperience: 3, proficiency: 'advanced' },
  { name: 'PowerApps', category: 'tools', yearsOfExperience: 2, proficiency: 'intermediate' },
  { name: 'Raspberry Pi', category: 'tools', yearsOfExperience: 3, proficiency: 'advanced' },
]

// Group tech stack by category for easier rendering
export const groupedTechStackNew = techStackNew.reduce((acc, tech) => {
  if (!acc[tech.category]) {
    acc[tech.category] = []
  }
  acc[tech.category].push(tech)
  return acc
}, {} as Record<string, TechStack[]>)
