"use client"

import { openSupportChat } from "@/components/features/support/featurebase-provider"

export function AuthFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="flex w-full max-w-[25rem] justify-between text-sm">
      <p className="text-muted-foreground">© {currentYear} 21st</p>
      <ul className="flex gap-2">
        <li className="flex items-center gap-2 after:size-[1.5px] after:rounded-full after:bg-muted-foreground last:after:hidden">
          <button
            type="button"
            className="relative rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-[#0033FF]"
            onClick={openSupportChat}
          >
            Support
          </button>
        </li>
        <li className="flex items-center gap-2 after:size-[1.5px] after:rounded-full after:bg-muted-foreground last:after:hidden">
          <a
            className="relative rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-[#0033FF]"
            href="https://21st.dev/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </li>
        <li className="flex items-center gap-2 after:size-[1.5px] after:rounded-full after:bg-muted-foreground last:after:hidden">
          <a
            className="relative rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-[#0033FF]"
            href="https://21st.dev/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </li>
      </ul>
    </footer>
  )
}



