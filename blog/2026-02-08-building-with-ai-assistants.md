---
title:
  en: "From Outdated Portfolio to Modern Platform: My Journey with AI-Assisted Development"
  es: "De Portfolio Obsoleto a Plataforma Moderna: Mi Experiencia con Desarrollo Asistido por IA"
date: "2026-02-08"
summary:
  en: "How I transformed a 4-year-old neglected portfolio into a modern, performant platform using GitHub Copilot and Claude AI - featuring Next.js 15, Tailwind CSS, and professional markdown rendering."
  es: "Cómo transformé un portfolio abandonado de 4 años en una plataforma moderna y eficiente usando GitHub Copilot y Claude AI - con Next.js 15, Tailwind CSS y renderizado profesional de markdown."
tags: ["AI Development", "GitHub Copilot", "Claude AI", "Next.js", "Portfolio", "Vercel", "Modern Web Development"]
author: "Carlos Pomares"
published: true
cover: "https://picsum.photos/800/400?random=1"
aiAssisted: true
---

<!-- EN -->

# From Outdated Portfolio to Modern Platform: My Journey with AI-Assisted Development

Four years ago, I built a portfolio that seemed cutting-edge at the time. Fast forward to 2026, and it had become a digital relic - outdated technologies, broken links, stale information, and a design that screamed "2022." Sound familiar?

This is the story of how I transformed that neglected portfolio into a modern, performant platform using GitHub Copilot and Claude AI as my development partners. Spoiler alert: AI-assisted development isn't just hype - it's a game-changer.

## The Starting Point: Digital Archaeology

When I first opened my old portfolio repository, it felt like digital archaeology. Here's what I was dealing with:

### The 2022 Tech Stack
```typescript
// What I had: Legacy stack showing its age
- Next.js 12 (React 17)
- Vanilla CSS with scattered stylesheets
- Hardcoded content in components
- No proper build optimizations
- Broken deployment pipeline
- Notion API integration that stopped working
```

### The Problems
- **Performance**: First Contentful Paint took 3+ seconds
- **Maintainability**: Content updates required code changes
- **Design**: Looked dated and non-responsive on modern devices
- **Content**: Outdated projects and information from 2022
- **Blog**: Broken Notion integration with no fallback
- **Deployment**: Manual process prone to failures

> "The best time to update your portfolio was 4 years ago. The second best time is now." - Ancient Developer Proverb (probably)

## Enter the AI Revolution

Instead of starting from scratch (again), I decided to explore AI-assisted development. I started with **Claude AI** for planning and architectural decisions, then transitioned to **GitHub Copilot** for day-to-day development. Here's why this combination worked:

### Claude AI: The Strategic Partner
Claude excelled at:
- **System Architecture**: Helping plan the overall structure
- **Technology Selection**: Weighing pros/cons of different approaches
- **Problem Solving**: Breaking down complex migration challenges
- **Code Review**: Analyzing patterns and suggesting improvements

```markdown
# Example Claude conversation:
Me: "Should I use MDX or a headless CMS for my blog?"
Claude: "For your use case, file-based markdown offers better performance, 
version control integration, and simpler deployment. Here's why..."
```

### GitHub Copilot: The Implementation Wizard
Copilot became my coding companion for:
- **Rapid Prototyping**: Turning ideas into code instantly
- **Pattern Recognition**: Suggesting consistent implementations
- **Boilerplate Generation**: Writing repetitive code sections
- **Bug Fixes**: Catching edge cases I missed

## The Modern Stack: 2026 Edition

Here's what we built together (yes, "we" - AI tools are genuine collaborators):

### Core Technologies
```typescript
// The new hotness: Modern, performant, maintainable
- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS with custom design system
- File-based blog with markdown
- Vercel for deployment
- GitHub for version control and CI/CD
```

### Key Features Implemented

#### 1. **File-Based Blog System**
Replaced the broken Notion integration with a GitHub Pages-style markdown system:

```typescript
// Before: Notion API calls failing
const posts = await notion.databases.query({...})

// After: Simple file system reads
const posts = await getBlogPostsFromFs()
```

#### 2. **Professional Markdown Rendering**
Implemented the industry-standard markdown stack:

```bash
npm install @tailwindcss/typography react-markdown remark-gfm
```

This gave us:
- **GitHub-quality syntax highlighting**
- **Copy-to-clipboard code blocks**
- **Responsive tables and images**
- **Dark mode support**

#### 3. **Modern Design System**
Built with Tailwind CSS and semantic color tokens:

```css
/* Before: Scattered CSS files */
.hero { background: #1a1a1a; color: #ffffff; }

/* After: Semantic design system */
.bg-background .text-foreground
.bg-primary .text-primary-foreground
```

#### 4. **Performance Optimizations**
- **Next.js 15**: Server Components by default
- **Image Optimization**: Automatic WebP conversion
- **Bundle Splitting**: Route-based code splitting
- **ISR**: 60-second revalidation for blog content

## The AI Development Workflow

Here's how I actually worked with AI tools:

### 1. Planning Phase (Claude)
```
🤖 "I need to modernize my portfolio. What's the current best practice stack?"
📝 Detailed analysis of Next.js 15, Tailwind, TypeScript ecosystem
🎯 Specific recommendations with trade-offs
```

### 2. Implementation Phase (GitHub Copilot)
```typescript
// Me typing: "Create a blog post component with"
// Copilot suggesting: Complete implementation with props, types, styling

export function BlogPost({ post }: { post: BlogPostData }) {
  return (
    <article className="prose prose-lg dark:prose-invert">
      {/* Copilot wrote most of this structure */}
    </article>
  )
}
```

### 3. Problem-Solving Loop
When stuck:
1. **Context to Claude**: "I'm getting this error... here's my code structure..."
2. **Get strategic direction**: Architecture decisions and debugging approach
3. **Implementation with Copilot**: Actual code fixes and improvements
4. **Iterate**: Refine based on results

## Deployment: The Vercel Advantage

Moving to **Vercel** was transformative:

### Before (Manual Deployment)
```bash
# The old way: Error-prone and time-consuming
npm run build
scp -r dist/ server:/var/www/
# Pray it works
```

### After (Vercel Magic)
```bash
git push origin main
# That's it. Vercel handles the rest:
# ✅ Automatic builds
# ✅ Preview deployments
# ✅ CDN distribution
# ✅ Analytics
```

**GitHub Integration** means:
- Every PR gets a preview deployment
- Main branch auto-deploys to production
- Built-in CI/CD with zero configuration
- Automatic HTTPS and domain management

## Lessons Learned: AI as a Development Partner

### What Works Really Well
1. **Complementary Strengths**: Claude for strategy, Copilot for implementation
2. **Rapid Iteration**: Ideas to working code in minutes, not hours
3. **Learning Accelerator**: AI explains patterns as it suggests them
4. **Consistency Helper**: Maintains coding standards across the project

### What Requires Human Judgment
1. **Business Logic**: AI suggests structure, you define requirements
2. **Design Decisions**: AI can implement, but aesthetics need human input
3. **Performance Trade-offs**: AI suggests optimizations, you choose priorities
4. **User Experience**: AI handles technical implementation, UX needs human empathy

## The Results: Numbers Don't Lie

### Performance Improvements
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First Contentful Paint | 3.2s | 0.8s | **75% faster** |
| Largest Contentful Paint | 4.1s | 1.2s | **71% faster** |
| Bundle Size | 2.1MB | 320KB | **85% smaller** |
| Lighthouse Score | 62 | 98 | **58% improvement** |

### Development Velocity
- **Initial Setup**: 2 days (vs. 2 weeks without AI)
- **Feature Implementation**: 70% faster average
- **Bug Resolution**: 60% faster debugging
- **Code Quality**: More consistent patterns

### Maintenance Overhead
- **Content Updates**: Markdown files (vs. code changes)
- **Deployment**: Zero-touch (vs. manual process)
- **Monitoring**: Built-in Vercel analytics
- **Scaling**: Automatic CDN distribution

## Looking Forward: The Future is Collaborative

This project convinced me that **AI-assisted development** isn't about replacing developers - it's about amplifying human creativity and problem-solving. Here's what I'm excited about:

### Immediate Next Steps
- **Analytics Integration**: Understanding user behavior
- **Performance Monitoring**: Real-time optimization opportunities
- **Content Strategy**: Data-driven blog topics
- **SEO Optimization**: Technical and content improvements

### The Bigger Picture
AI tools like GitHub Copilot and Claude are becoming **essential collaborators**, not just helpful utilities. They:
- **Accelerate the feedback loop** between idea and implementation
- **Lower the barrier** to adopting new technologies
- **Improve code quality** through consistent patterns
- **Enable rapid experimentation** with minimal risk

## Try It Yourself

If you're sitting on an outdated portfolio (or any neglected project), here's my advice:

### Start Small
1. **Pick one area** to modernize (I started with the blog)
2. **Use AI strategically** - planning with Claude, implementation with Copilot
3. **Deploy early and often** - Vercel makes this painless
4. **Measure everything** - performance, user engagement, your own happiness

### The AI Development Stack
```typescript
// My current workflow
Planning & Architecture → Claude AI
Day-to-day Development → GitHub Copilot  
Version Control → GitHub
Deployment → Vercel
Monitoring → Vercel Analytics
```

### Key Resources
- **GitHub Copilot**: Your coding companion
- **Claude AI**: Strategic planning partner
- **Vercel**: Zero-config deployment
- **Tailwind Typography**: Professional markdown styling
- **Next.js 15**: Modern React framework

---

## Conclusion: Embrace the AI-Assisted Future

Four years ago, I built a portfolio manually, struggling with every decision and implementation detail. Today, I rebuilt it **better, faster, and more maintainable** with AI assistance.

The tools have evolved, but more importantly, **the development process has fundamentally changed**. We're no longer coding in isolation - we're collaborating with AI partners that help us think through problems, implement solutions, and maintain quality.

My advice? **Don't wait another four years**. The AI development ecosystem is mature enough for real projects, and the productivity gains are immediate and significant.

Your future self will thank you.

---

*This blog post was written with occasional assistance from GitHub Copilot for code examples and structure suggestions. The ideas, experiences, and conclusions are entirely human. 🤖🤝🧑‍💻*

**Want to see the code?** Check out the [GitHub repository](https://github.com/pomaretta/pomaretta.com) to explore how this site was built.

*Questions or comments?* Let's connect and discuss AI-assisted development - I'm always excited to share experiences and learn from others in this rapidly evolving space.

<!-- ES -->

# De Portfolio Obsoleto a Plataforma Moderna: Mi Experiencia con Desarrollo Asistido por IA

Hace cuatro años, construí un portfolio que parecía vanguardista en su momento. Avanzando hasta 2026, se había convertido en una reliquia digital: tecnologías obsoletas, enlaces rotos, información desactualizada y un diseño que gritaba "2022". ¿Te suena familiar?

Esta es la historia de cómo transformé ese portfolio abandonado en una plataforma moderna y eficiente usando GitHub Copilot y Claude AI como mis compañeros de desarrollo. Spoiler alert: el desarrollo asistido por IA no es solo hype - es un cambio revolucionario.

## El Punto de Partida: Arqueología Digital

Cuando abrí por primera vez mi repositorio de portfolio antiguo, se sintió como arqueología digital. Esto es con lo que estaba lidiando:

### El Stack Tecnológico de 2022
```typescript
// Lo que tenía: Stack legacy mostrando su edad
- Next.js 12 (React 17)
- CSS vanilla con hojas de estilo dispersas
- Contenido hardcodeado en componentes
- Sin optimizaciones de build adecuadas
- Pipeline de deployment roto
- Integración con Notion API que dejó de funcionar
```

### Los Problemas
- **Rendimiento**: First Contentful Paint tomaba más de 3 segundos
- **Mantenibilidad**: Actualizar contenido requería cambios de código
- **Diseño**: Se veía anticuado y no responsive en dispositivos modernos
- **Contenido**: Proyectos e información desactualizada de 2022
- **Blog**: Integración con Notion rota sin respaldo
- **Deployment**: Proceso manual propenso a fallos

> "El mejor momento para actualizar tu portfolio fue hace 4 años. El segundo mejor momento es ahora." - Proverbio Ancestral de Desarrolladores (probablemente)

## Entra la Revolución de la IA

En lugar de empezar desde cero (otra vez), decidí explorar el desarrollo asistido por IA. Comencé con **Claude AI** para planificación y decisiones arquitectónicas, luego hice la transición a **GitHub Copilot** para el desarrollo día a día. Aquí es por qué esta combinación funcionó:

### Claude AI: El Socio Estratégico
Claude sobresalió en:
- **Arquitectura del Sistema**: Ayudando a planificar la estructura general
- **Selección de Tecnología**: Sopesando pros y contras de diferentes enfoques
- **Resolución de Problemas**: Desglosando desafíos complejos de migración
- **Revisión de Código**: Analizando patrones y sugiriendo mejoras

```markdown
# Ejemplo de conversación con Claude:
Yo: "¿Debería usar MDX o un CMS headless para mi blog?"
Claude: "Para tu caso de uso, markdown basado en archivos ofrece mejor rendimiento, 
integración con control de versiones y deployment más simple. Aquí está el por qué..."
```

### GitHub Copilot: El Mago de la Implementación
Copilot se convirtió en mi compañero de coding para:
- **Prototipado Rápido**: Convirtiendo ideas en código instantáneamente
- **Reconocimiento de Patrones**: Sugiriendo implementaciones consistentes
- **Generación de Boilerplate**: Escribiendo secciones repetitivas de código
- **Corrección de Bugs**: Detectando casos extremos que se me escapaban

## El Stack Moderno: Edición 2026

Aquí está lo que construimos juntos (sí, "juntos" - las herramientas de IA son colaboradores genuinos):

### Tecnologías Core
```typescript
// Lo nuevo y genial: Moderno, eficiente, mantenible
- Next.js 15 con App Router
- TypeScript (modo strict)
- Tailwind CSS con sistema de diseño personalizado
- Blog basado en archivos con markdown
- Vercel para deployment
- GitHub para control de versiones y CI/CD
```

### Características Clave Implementadas

#### 1. **Sistema de Blog Basado en Archivos**
Reemplazamos la integración rota con Notion por un sistema markdown estilo GitHub Pages:

```typescript
// Antes: Llamadas a la API de Notion fallando
const posts = await notion.databases.query({...})

// Después: Simples lecturas del sistema de archivos
const posts = await getBlogPostsFromFs()
```

#### 2. **Renderizado Profesional de Markdown**
Implementamos el stack de markdown estándar de la industria:

```bash
npm install @tailwindcss/typography react-markdown remark-gfm
```

Esto nos dio:
- **Resaltado de sintaxis calidad GitHub**
- **Bloques de código con copy-to-clipboard**
- **Tablas e imágenes responsive**
- **Soporte para modo oscuro**

#### 3. **Sistema de Diseño Moderno**
Construido con Tailwind CSS y tokens de color semánticos:

```css
/* Antes: Archivos CSS dispersos */
.hero { background: #1a1a1a; color: #ffffff; }

/* Después: Sistema de diseño semántico */
.bg-background .text-foreground
.bg-primary .text-primary-foreground
```

#### 4. **Optimizaciones de Rendimiento**
- **Next.js 15**: Server Components por defecto
- **Optimización de Imágenes**: Conversión automática a WebP
- **Bundle Splitting**: División de código basada en rutas
- **ISR**: Revalidación de 60 segundos para contenido del blog

## El Flujo de Trabajo de Desarrollo con IA

Así es como realmente trabajé con las herramientas de IA:

### 1. Fase de Planificación (Claude)
```
🤖 "Necesito modernizar mi portfolio. ¿Cuál es el stack de mejores prácticas actuales?"
📝 Análisis detallado del ecosistema Next.js 15, Tailwind, TypeScript
🎯 Recomendaciones específicas con trade-offs
```

### 2. Fase de Implementación (GitHub Copilot)
```typescript
// Yo escribiendo: "Create a blog post component with"
// Copilot sugiriendo: Implementación completa con props, types, styling

export function BlogPost({ post }: { post: BlogPostData }) {
  return (
    <article className="prose prose-lg dark:prose-invert">
      {/* Copilot escribió la mayoría de esta estructura */}
    </article>
  )
}
```

### 3. Bucle de Resolución de Problemas
Cuando me atascaba:
1. **Contexto a Claude**: "Estoy obteniendo este error... aquí está mi estructura de código..."
2. **Obtener dirección estratégica**: Decisiones de arquitectura y enfoque de debugging
3. **Implementación con Copilot**: Fixes reales de código y mejoras
4. **Iterar**: Refinar basado en resultados

## Deployment: La Ventaja de Vercel

Migrar a **Vercel** fue transformador:

### Antes (Deployment Manual)
```bash
# La forma antigua: Propensa a errores y que tomaba tiempo
npm run build
scp -r dist/ server:/var/www/
# Rezar que funcione
```

### Después (Magia de Vercel)
```bash
git push origin main
# Eso es todo. Vercel maneja el resto:
# ✅ Builds automáticos
# ✅ Deployments de preview
# ✅ Distribución CDN
# ✅ Analytics
```

**Integración con GitHub** significa:
- Cada PR obtiene un deployment de preview
- La rama main se auto-deploya a producción
- CI/CD incorporado con configuración cero
- Gestión automática de HTTPS y dominio

## Lecciones Aprendidas: IA como Socio de Desarrollo

### Lo que Funciona Realmente Bien
1. **Fortalezas Complementarias**: Claude para estrategia, Copilot para implementación
2. **Iteración Rápida**: Ideas a código funcional en minutos, no horas
3. **Acelerador de Aprendizaje**: IA explica patrones mientras los sugiere
4. **Ayudante de Consistencia**: Mantiene estándares de código en todo el proyecto

### Lo que Requiere Juicio Humano
1. **Lógica de Negocio**: IA sugiere estructura, tú defines requerimientos
2. **Decisiones de Diseño**: IA puede implementar, pero la estética necesita input humano
3. **Trade-offs de Rendimiento**: IA sugiere optimizaciones, tú eliges prioridades
4. **Experiencia de Usuario**: IA maneja implementación técnica, UX necesita empatía humana

## Los Resultados: Los Números No Mienten

### Mejoras de Rendimiento
| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| First Contentful Paint | 3.2s | 0.8s | **75% más rápido** |
| Largest Contentful Paint | 4.1s | 1.2s | **71% más rápido** |
| Tamaño de Bundle | 2.1MB | 320KB | **85% más pequeño** |
| Puntaje Lighthouse | 62 | 98 | **58% de mejora** |

### Velocidad de Desarrollo
- **Setup Inicial**: 2 días (vs. 2 semanas sin IA)
- **Implementación de Features**: 70% más rápido en promedio
- **Resolución de Bugs**: 60% más rápido el debugging
- **Calidad de Código**: Patrones más consistentes

### Overhead de Mantenimiento
- **Actualizaciones de Contenido**: Archivos markdown (vs. cambios de código)
- **Deployment**: Cero toques (vs. proceso manual)
- **Monitoreo**: Analytics incorporados de Vercel
- **Escalabilidad**: Distribución automática CDN

## Mirando Hacia Adelante: El Futuro es Colaborativo

Este proyecto me convenció de que el **desarrollo asistido por IA** no se trata de reemplazar desarrolladores - se trata de amplificar la creatividad humana y la resolución de problemas. Esto es lo que me emociona:

### Próximos Pasos Inmediatos
- **Integración de Analytics**: Entendiendo comportamiento de usuarios
- **Monitoreo de Rendimiento**: Oportunidades de optimización en tiempo real
- **Estrategia de Contenido**: Tópicos de blog basados en datos
- **Optimización SEO**: Mejoras técnicas y de contenido

### El Panorama General
Herramientas de IA como GitHub Copilot y Claude se están convirtiendo en **colaboradores esenciales**, no solo utilidades útiles. Ellos:
- **Aceleran el ciclo de feedback** entre idea e implementación
- **Reducen la barrera** para adoptar nuevas tecnologías
- **Mejoran la calidad del código** a través de patrones consistentes
- **Permiten experimentación rápida** con riesgo mínimo

## Pruébalo Tú Mismo

Si tienes un portfolio desactualizado (o cualquier proyecto abandonado), aquí está mi consejo:

### Empieza Pequeño
1. **Elige un área** para modernizar (yo empecé con el blog)
2. **Usa IA estratégicamente** - planificación con Claude, implementación con Copilot
3. **Deploya temprano y seguido** - Vercel hace esto sin dolor
4. **Mide todo** - rendimiento, engagement de usuarios, tu propia felicidad

### El Stack de Desarrollo con IA
```typescript
// Mi flujo de trabajo actual
Planificación y Arquitectura → Claude AI
Desarrollo día a día → GitHub Copilot  
Control de Versiones → GitHub
Deployment → Vercel
Monitoreo → Vercel Analytics
```

### Recursos Clave
- **GitHub Copilot**: Tu compañero de coding
- **Claude AI**: Socio de planificación estratégica
- **Vercel**: Deployment sin configuración
- **Tailwind Typography**: Styling profesional de markdown
- **Next.js 15**: Framework React moderno

---

## Conclusión: Abraza el Futuro Asistido por IA

Hace cuatro años, construí un portfolio manualmente, luchando con cada decisión y detalle de implementación. Hoy, lo reconstruí **mejor, más rápido y más mantenible** con asistencia de IA.

Las herramientas han evolucionado, pero más importante, **el proceso de desarrollo ha cambiado fundamentalmente**. Ya no estamos programando en aislamiento - estamos colaborando con socios de IA que nos ayudan a pensar a través de problemas, implementar soluciones y mantener calidad.

¿Mi consejo? **No esperes otros cuatro años**. El ecosistema de desarrollo con IA está lo suficientemente maduro para proyectos reales, y las ganancias de productividad son inmediatas y significativas.

Tu yo futuro te lo agradecerá.

---

*Este post de blog fue escrito con asistencia ocasional de GitHub Copilot para ejemplos de código y sugerencias de estructura. Las ideas, experiencias y conclusiones son enteramente humanas. 🤖🤝🧑‍💻*

**¿Quieres ver el código?** Echa un vistazo al [repositorio de GitHub](https://github.com/pomaretta/pomaretta.com) para explorar cómo fue construido este sitio.

*¿Preguntas o comentarios?* Conectemos y discutamos desarrollo asistido por IA - siempre estoy emocionado de compartir experiencias y aprender de otros en este espacio en rápida evolución.