'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { projects } from '@/data/projects'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'

export function ProjectsNew() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Featured Projects</h2>
        </FadeInUp>

        <div className="space-y-12">
          {projects.map((project, idx) => (
            <FadeInUp key={project.id} delay={0.3 + idx * 0.1}>
              <article className="group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-muted-foreground transition-colors">
                        {project.title}
                      </h3>
                      {project.year && (
                        <span className="text-sm text-muted-foreground">{project.year}</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {project.github && (
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                      )}
                      {project.demo && (
                        <Link
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.longDescription || project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-white/5 rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}
