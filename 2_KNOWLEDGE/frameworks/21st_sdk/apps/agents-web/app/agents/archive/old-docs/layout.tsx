import { Nav } from "@/components/features/agents/an/archive/docs/nav"
import { Sidebar } from "@/components/features/agents/an/archive/docs/sidebar"
import { TableOfContents } from "@/components/features/agents/an/archive/docs/toc"
import { SearchProvider } from "@/components/features/agents/an/archive/docs/search-context"
import { FrameworkProvider } from "@/lib/agents-docs/framework-context"
import { buildSearchIndex } from "@/lib/agents-docs/search"

export default function AnDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchIndex = buildSearchIndex()

  return (
    <FrameworkProvider>
      <SearchProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav searchIndex={searchIndex} />
          <div className="mx-auto flex max-w-[1440px]">
            <Sidebar />
            <main className="min-w-0 flex-1 border-r border-border px-12 py-10 xl:border-r-0">
              <div data-docs-content className="mx-auto max-w-[680px]">
                {children}
              </div>
            </main>
            <TableOfContents />
          </div>
        </div>
      </SearchProvider>
    </FrameworkProvider>
  )
}
