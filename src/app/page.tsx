import { Navigation } from '@/components/layout/Navigation'
import { HeroNew } from '@/components/sections/HeroNew'
import { WhatIBuild } from '@/components/sections/WhatIBuild'
import { ExperienceNew } from '@/components/sections/ExperienceNew'
import { TechStackNew } from '@/components/sections/TechStackNew'
import { BeyondCode } from '@/components/sections/BeyondCode'
// import { BlogPreview } from '@/components/sections/BlogPreview' // Temporarily disabled
import { GitHubActivity } from '@/components/sections/GitHubActivity'
import { CodeRunnerGame } from '@/components/sections/CodeRunnerGame'
import { ContactNew } from '@/components/sections/ContactNew'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroNew />
        <WhatIBuild />
        <ExperienceNew />
        <TechStackNew />
        <BeyondCode />
        {/* <BlogPreview /> */}
        <GitHubActivity />
        <CodeRunnerGame />
        <ContactNew />
      </main>
    </div>
  )
}
