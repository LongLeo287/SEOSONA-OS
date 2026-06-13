const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://21st.dev"

export function buildDocArticleJsonLd(opts: {
  title: string
  description: string
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: opts.title,
    description: opts.description,
    url: `${BASE_URL}${opts.path}`,
    author: {
      "@type": "Organization",
      name: "21st.dev",
      url: "https://21st.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "21st.dev",
      url: "https://21st.dev",
    },
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "21st Agents Documentation",
      url: `${BASE_URL}/docs`,
    },
  }
}

export function buildBreadcrumbJsonLd(
  crumbs: { name: string; path?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: `${BASE_URL}${crumb.path}` } : {}),
    })),
  }
}
