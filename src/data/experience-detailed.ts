import { Experience } from '@/types'

interface LocalizedExperience extends Omit<Experience, 'description' | 'achievements' | 'role'> {
  role: { en: string; es: string }
  description: { en: string; es: string }
  achievements?: { en: string[]; es: string[] }
}

const experiencesDetailedData: LocalizedExperience[] = [
  {
    id: '4',
    company: 'WebBeds',
    role: {
      en: 'ML DevOps',
      es: 'ML DevOps',
    },
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2025-07',
    description: {
      en: 'Manage and deploy AI processes in distributed systems. Deploy agentic solutions in an enterprise environment. Create and manage new internal architectures for handling new technologies.',
      es: 'Gestionar y desplegar procesos de IA en sistemas distribuidos. Desplegar soluciones agénticas en un entorno empresarial. Crear y gestionar nuevas arquitecturas internas para manejar nuevas tecnologías.',
    },
    achievements: {
      en: [
        'Built sophisticated AI Agent for automated data analysis using LLMs',
        'Deployed AI image curation system improving content quality and relevance',
        'Architected RAG system handling 1M+ documents with semantic search',
        'Developed AI-powered hotel search with 10M+ location dataset using pgvector',
        'Created custom NER models for room type mapping and query understanding',
        'Implemented end-to-end ML pipelines with monitoring and observability',
      ],
      es: [
        'Construí un Agente de IA sofisticado para análisis automatizado de datos usando LLMs',
        'Desplegué sistema de curación de imágenes con IA mejorando la calidad y relevancia del contenido',
        'Arquitecturé sistema RAG manejando más de 1M de documentos con búsqueda semántica',
        'Desarrollé búsqueda de hoteles con IA usando conjunto de datos de más de 10M de ubicaciones con pgvector',
        'Creé modelos NER personalizados para mapeo de tipos de habitación y comprensión de consultas',
        'Implementé pipelines ML end-to-end con monitorización y observabilidad',
      ],
    },
    technologies: [
      'LangChain',
      'AWS Bedrock',
      'AWS Lambda',
      'Python',
      'TensorFlow',
      'PyTorch',
      'SpaCy',
      'LLMs',
      'Claude (Anthropic)',
      'AWS Titan Embeddings',
      'OpenSearch',
      'pgvector',
      'Postgres',
      'Docker',
      'Kubernetes',
    ],
  },
  {
    id: '3',
    company: 'WebBeds',
    role: {
      en: 'Data Engineer',
      es: 'Ingeniero de Datos',
    },
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2023-08',
    endDate: '2025-07',
    description: {
      en: 'AI Integrations, DevOps CI/CD with AWS CDK, Golang API features & FastAPI integrations.',
      es: 'Integraciones de IA, DevOps CI/CD con AWS CDK, funcionalidades de API en Golang e integraciones FastAPI.',
    },
    achievements: {
      en: [
        'Implemented AI integrations across multiple services',
        'Built CI/CD pipelines with AWS CDK for automated deployments',
        'Developed Golang API features for high-performance services',
        'Created FastAPI integrations for Python-based microservices',
        'Deployed cloud-native applications using AWS services',
      ],
      es: [
        'Implementé integraciones de IA en múltiples servicios',
        'Construí pipelines CI/CD con AWS CDK para despliegues automatizados',
        'Desarrollé funcionalidades de API en Golang para servicios de alto rendimiento',
        'Creé integraciones FastAPI para microservicios basados en Python',
        'Desplegué aplicaciones cloud-native usando servicios AWS',
      ],
    },
    technologies: [
      'Python',
      'Golang',
      'FastAPI',
      'AWS CDK',
      'AWS Lambda',
      'Git',
      'Amazon RDS',
      'Docker',
    ],
  },
  {
    id: '2',
    company: 'WebBeds',
    role: {
      en: 'Junior Data Engineer',
      es: 'Ingeniero de Datos Junior',
    },
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2022-07',
    endDate: '2023-08',
    description: {
      en: 'AWS Cloud based Applications and Pipelines. Developed Python ETLs running on EC2 and ECS Instances, Golang APIs, and Front-End applications for end-user access.',
      es: 'Aplicaciones y Pipelines basados en AWS Cloud. Desarrollé ETLs en Python ejecutándose en instancias EC2 y ECS, APIs en Golang y aplicaciones Front-End para acceso de usuario final.',
    },
    achievements: {
      en: [
        'Built Python ETLs running on EC2 and ECS Instances',
        'Implemented ECS Automated Migration using Autoscaling, processing more than 50 ETLs per minute',
        'Developed Golang API running on Lambda through API Gateway using Bearer Auth',
        'Managed AWS S3, Athena, Postgres RDS, Serverless Deployments, CI/CD Pipelines',
        'Created Python Libraries Development for common integrations and ETLs',
        'Optimized Python Validation and Data Processing for High Performance Services',
        'Deployed infrastructure using Python AWS CDK',
        'Built VueJS Portal for End-User easy access to PowerApps',
        'Delivered Microsoft Power Apps as main End-User Applications',
      ],
      es: [
        'Construí ETLs en Python ejecutándose en instancias EC2 y ECS',
        'Implementé migración automatizada de ECS usando Autoscaling, procesando más de 50 ETLs por minuto',
        'Desarrollé API en Golang ejecutándose en Lambda a través de API Gateway usando Bearer Auth',
        'Gestioné AWS S3, Athena, Postgres RDS, Despliegues Serverless, Pipelines CI/CD',
        'Creé librerías Python para integraciones comunes y ETLs',
        'Optimicé validación Python y procesamiento de datos para servicios de alto rendimiento',
        'Desplegué infraestructura usando Python AWS CDK',
        'Construí portal VueJS para facilitar acceso de usuarios finales a PowerApps',
        'Entregué Microsoft Power Apps como aplicaciones principales para usuario final',
      ],
    },
    technologies: [
      'Python',
      'Golang',
      'VueJS',
      'AWS Lambda',
      'EC2',
      'ECS',
      'API Gateway',
      'AWS CDK',
      'S3',
      'Athena',
      'Postgres',
      'CloudFormation',
      'Docker',
      'PowerApps',
      'Git',
    ],
  },
  {
    id: '1',
    company: 'WebBeds',
    role: {
      en: 'Junior Data Engineer Internship',
      es: 'Prácticas Ingeniero de Datos Junior',
    },
    location: 'Palma, Balearic Islands, Spain',
    startDate: '2021-04',
    endDate: '2022-07',
    description: {
      en: 'Dual Professional Training (Formación Profesional Dual). Part-time internship while completing studies, working on ETL jobs, data processing, and AWS services.',
      es: 'Formación Profesional Dual. Prácticas a tiempo parcial mientras completaba mis estudios, trabajando en trabajos ETL, procesamiento de datos y servicios AWS.',
    },
    achievements: {
      en: [
        'Developed ETL Jobs using Pandas, SQS, and Golang',
        'Implemented Pandas data comparison and validation',
        'Created Bash scripts for automation tasks',
        'Worked with ECS Tasks for containerized workloads',
        'Deployed serverless functions using AWS Lambda',
      ],
      es: [
        'Desarrollé trabajos ETL usando Pandas, SQS y Golang',
        'Implementé comparación y validación de datos con Pandas',
        'Creé scripts Bash para tareas de automatización',
        'Trabajé con ECS Tasks para cargas de trabajo en contenedores',
        'Desplegué funciones serverless usando AWS Lambda',
      ],
    },
    technologies: ['Python', 'Pandas', 'Golang', 'Bash', 'AWS Lambda', 'SQS', 'ECS', 'Git', 'Amazon RDS'],
  },
]

// Helper function to get localized experience
export function getLocalizedExperiences(locale: 'en' | 'es'): Experience[] {
  return experiencesDetailedData.map((exp) => ({
    ...exp,
    role: exp.role[locale],
    description: exp.description[locale],
    achievements: exp.achievements?.[locale],
  }))
}

// Keep the old export for backwards compatibility but default to English
export const experiencesDetailed: Experience[] = getLocalizedExperiences('en')
