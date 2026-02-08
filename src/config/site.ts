export const siteConfig = {
  name: "Carlos Pomares | Data & AI Engineer",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.pomaretta.com",
  description: "Portfolio website of Carlos Pomares, a Data & AI Engineer specializing in building intelligent systems and deploying production-ready AI solutions.",
  author: {
    name: "Carlos Pomares",
    email: "contact@pomaretta.com",
  },
  links: {
    github: "https://github.com/pomaretta",
    linkedin: "https://linkedin.com/in/pomaretta",
    twitter: "https://twitter.com/pomaretta",
  },
}

export type SiteConfig = typeof siteConfig
