'use client'

import { FadeInUp } from '@/components/animations/FadeInUp'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Cpu, Database, Brain, Cloud, Zap, Wrench } from 'lucide-react'

export function WhatIBuild() {
  const { t } = useLanguage()

  const capabilities = [
    {
      icon: Cpu,
      title: t.whatIBuild.capabilities.mlInfra.title,
      description: t.whatIBuild.capabilities.mlInfra.description,
    },
    {
      icon: Database,
      title: t.whatIBuild.capabilities.dataPipelines.title,
      description: t.whatIBuild.capabilities.dataPipelines.description,
    },
    {
      icon: Brain,
      title: t.whatIBuild.capabilities.aiSystems.title,
      description: t.whatIBuild.capabilities.aiSystems.description,
    },
    {
      icon: Cloud,
      title: t.whatIBuild.capabilities.cloudArch.title,
      description: t.whatIBuild.capabilities.cloudArch.description,
    },
    {
      icon: Zap,
      title: t.whatIBuild.capabilities.apis.title,
      description: t.whatIBuild.capabilities.apis.description,
    },
    {
      icon: Wrench,
      title: t.whatIBuild.capabilities.devTools.title,
      description: t.whatIBuild.capabilities.devTools.description,
    },
  ]

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeInUp delay={0.2}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.whatIBuild.title}
          </h2>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <FadeInUp key={index} delay={0.3 + index * 0.1}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 shadow-lg shadow-black/10 h-full">
                <capability.icon className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  )
}
