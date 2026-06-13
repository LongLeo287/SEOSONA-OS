import { AgentsLink as Link } from "@/components/agents-link"

export default function AnNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-foreground px-6 py-2 text-sm text-background transition-colors hover:bg-foreground/90"
      >
        Go home
      </Link>
    </div>
  )
}
