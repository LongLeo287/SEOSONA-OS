import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { rehypeCode } from "@/lib/agents-docs/rehype-code"
import { getDocBySlug, getAllDocSlugs } from "@/lib/agents-docs/mdx"
import { mdxComponents } from "@/components/features/agents/an/archive/docs/mdx-components"
import { Breadcrumb } from "@/components/features/agents/an/archive/docs/breadcrumb"
import { PageNav } from "@/components/features/agents/an/archive/docs/page-nav"

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export default async function AnDocPage({ params }: PageProps) {
  const { slug } = await params
  const docSlug = slug || ["index"]

  const doc = getDocBySlug(docSlug)
  if (!doc) notFound()

  return (
    <article>
      <Breadcrumb />
      <MDXRemote
        source={doc.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeCode],
          },
        }}
      />
      <PageNav />
    </article>
  )
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return [
    { slug: undefined },
    ...slugs.map((s) => ({ slug: s })),
  ]
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const docSlug = slug || ["index"]
  const doc = getDocBySlug(docSlug)

  if (!doc) return { title: "Not Found" }

  return {
    title: `${doc.meta.title} | 21st Agents SDK Docs`,
    description: doc.meta.description,
  }
}
