"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getRoutesBySection } from "../lib/routes"
import { ChevronDown, Sun, Moon } from "lucide-react"

interface SidebarProps {
  colorMode: "light" | "dark"
  onColorModeChange: (mode: "light" | "dark") => void
}

export function ShowcaseSidebar({ colorMode, onColorModeChange }: SidebarProps) {
  const pathname = usePathname()
  const sections = getRoutesBySection()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <aside className="w-60 h-full border-r flex flex-col bg-white" style={{ borderColor: "#e5e5e5" }}>
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#e5e5e5" }}>
        <Link href="/agents/showcase" className="text-sm font-semibold text-gray-900 no-underline">
          21st Agents SDK Showcase
        </Link>
        <button
          onClick={() => onColorModeChange(colorMode === "light" ? "dark" : "light")}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
        >
          {colorMode === "light" ? (
            <Moon className="w-4 h-4 text-gray-500" />
          ) : (
            <Sun className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {/* Overview link */}
        {sections["Overview"]?.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`block px-4 py-1.5 text-sm no-underline transition-colors ${
              pathname === route.path
                ? "text-blue-600 bg-blue-50 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {route.label}
          </Link>
        ))}

        {/* Grouped sections */}
        {["Components", "Tools", "Theme"].map((section) => {
          const routes = sections[section]
          if (!routes) return null
          const isCollapsed = collapsed[section]

          return (
            <div key={section} className="mt-2">
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
              >
                {section}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>
              {!isCollapsed &&
                routes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`block px-4 py-1.5 text-sm no-underline transition-colors ${
                      pathname === route.path
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
