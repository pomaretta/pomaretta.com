import { Experience, Education } from '@/types'

export const experiences: Experience[] = [
  {
    id: '3',
    company: 'WebBeds',
    role: 'ML DevOps Engineer',
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2024-01',
    // endDate: undefined means current position
    description: 'Leading ML infrastructure initiatives, building and deploying AI models at scale. Designing cloud-native solutions for ML workflows and managing the full MLOps lifecycle from model training to production deployment.',
    achievements: [
      'Built end-to-end ML pipelines for production AI systems',
      'Deployed and scaled ML models using Kubernetes and serverless architectures',
      'Implemented CI/CD pipelines for ML model deployment and monitoring',
      'Designed infrastructure for real-time inference and batch processing',
      'Led adoption of MLOps best practices across engineering teams',
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'AWS Bedrock', 'Claude (Anthropic)', 'Docker', 'Terraform', 'Airflow'],
  },
  {
    id: '2',
    company: 'WebBeds',
    role: 'Data Engineer',
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2022-09',
    endDate: '2023-12',
    description: 'Built scalable data pipelines and infrastructure for processing millions of travel transactions. Designed and implemented data warehousing solutions and real-time analytics systems.',
    achievements: [
      'Architected data pipelines processing 10M+ daily events',
      'Built real-time streaming pipelines with Kafka and Spark',
      'Developed data APIs using Go and Node.js for internal teams',
      'Implemented data quality monitoring and automated testing',
      'Attended International JavaScript Conference in Munich',
    ],
    technologies: ['Go', 'Python', 'Apache Spark', 'Kafka', 'AWS', 'Snowflake', 'Airflow', 'Docker', 'PostgreSQL'],
  },
  {
    id: '1',
    company: 'WebBeds',
    role: 'Software Engineering Intern (Half-Time)',
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2021-03',
    endDate: '2022-08',
    description: 'Part-time internship while completing studies, working on web applications and gaining hands-on experience with full-stack development in a production environment.',
    achievements: [
      'Contributed to front-end development using React and TypeScript',
      'Built REST APIs and backend services with Node.js',
      'Participated in code reviews and agile development processes',
      'Collaborated with senior engineers on feature development',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Git', 'REST APIs'],
  },
]

export const education: Education[] = [
  {
    id: '1',
    institution: 'CIDE',
    degree: 'CFGS de Desarrollo de Aplicaciones Multiplataforma',
    field: 'Software Development & Management',
    location: 'Palma, Spain',
    startDate: '2020',
    endDate: '2022',
    gpa: '9.5',
    honors: 'Matrícula de Honor',
    description: 'Comprehensive program covering multiplatform application development, software engineering principles, and project management.',
  },
]
