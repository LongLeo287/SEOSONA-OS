"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  BoltLogoIcon,
  CursorAnimatedLogoIcon,
  CursorLogoIcon,
  EnterIcon,
  GitHubIcon,
  LovableLogoIcon,
  ReplitWithTextIcon,
  TwitterIcon,
  V0LogoIcon,
  VscodeIcon,
  WindsurfLogoIcon,
  ClaudeCodeLogoIcon,
} from "@/components/icons"
import { setCookie } from "@/lib/cookies"

import { Button } from "./button"
import { GitHubStarsBasic } from "./github-stars-number"
import { Logo } from "./logo"
import { useUser } from "@clerk/nextjs"

export function HeroSection() {
  const router = useRouter()
  const { user } = useUser()

  const onEnterWebsite = async () => {
    await setCookie({
      name: "has_visited",
      value: "true",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
    })
    // Redirect new users to community components
    router.refresh()
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        await onEnterWebsite()
      }
    }
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [router])

  // Light theme colors matching globals.css design system
  const lightBg = "#ffffff" // --background: 0 0% 100%
  const lightBorder = "#e4e4e7" // --border: 240 5.9% 90%
  const lightText = "#0a0a0b" // --foreground: 240 10% 3.9%
  const lightTextSecondary = "#71717a" // --muted-foreground: 240 3.8% 46.1%
  const lightTextMuted = "#71717a" // --muted-foreground: 240 3.8% 46.1%
  const lightGradient1 =
    "linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.8))"
  const lightGradient2 =
    "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.6))"
  const lightGradient3 =
    "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4))"
  const lightGridBg =
    "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0.5' y='0.5' width='39' height='39' rx='3.5' fill='white'/%3E%3Cpath d='M0 39.5H40V40H0V39.5ZM39.5 0V40H40V0H39.5ZM0 0.5H40V0H0V0.5ZM0.5 0V40H0V0H0.5Z' fill='%23e4e4e7'/%3E%3C/svg%3E\")"
  const lightButtonBg = "#f4f4f5" // --secondary/--muted: 240 4.8% 95.9%
  const lightButtonBorder = "#d4d4d8" // --input: 240 4.9% 83.9%
  const lightLogoText = "#18181b" // --secondary-foreground: 240 5.9% 10%

  return (
    <div
      className="fixed inset-0 z-50"
      style={{
        background: lightBg,
        color: lightText,
      }}
    >
      <div className="flex flex-1 flex-col mx-2 mb-2">
        <div
          className="flex-1 p-0 md:p-4 mt-2 rounded-lg border relative overflow-hidden flex flex-col min-h-[calc(100vh-2rem)]"
          style={{
            background: lightBg,
            borderColor: lightBorder,
          }}
        >
          <div
            className="absolute inset-x-0 -top-[190%] bottom-0 pointer-events-none opacity-50 bg-grid-adaptive"
            style={{
              backgroundImage: lightGridBg,
              opacity: 0.5,
            }}
          />

          {/* Centered Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="absolute top-[2rem] md:top-[3.5rem] left-[calc(50%-14px)] transform -translate-x-1/2 z-20"
          >
            <div className="h-8 flex items-center justify-center">
              <Logo className="h-8 w-8" position="flex" />
            </div>
          </motion.div>

          <div className="container relative z-10">
            <div className="flex flex-col pb-4 pt-10 gap-4 min-h-[calc(100vh-4rem)]">
              {/* Navigation Bar */}
              <div className="w-full hidden md:flex items-center justify-between px-4">
                {/* Left Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex items-center gap-6"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm transition-colors hover:bg-transparent"
                    style={{
                      color: lightTextSecondary,
                    }}
                    onClick={onEnterWebsite}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(116, 116, 122, 0.1)"
                      ;(e.currentTarget as HTMLElement).style.color = lightText
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.color =
                        lightTextSecondary
                    }}
                    asChild
                  >
                    <Link href="/">Components</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm transition-colors hover:bg-transparent"
                    style={{
                      color: lightTextSecondary,
                    }}
                    onClick={onEnterWebsite}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(116, 116, 122, 0.1)"
                      ;(e.currentTarget as HTMLElement).style.color = lightText
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.color =
                        lightTextSecondary
                    }}
                    asChild
                  >
                    <Link href="/magic">AI Agent</Link>
                  </Button>
                </motion.div>

                {/* Right Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="flex items-center gap-6"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-sm transition-colors hover:bg-transparent"
                    style={{
                      color: lightTextSecondary,
                    }}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(116, 116, 122, 0.1)"
                      ;(e.currentTarget as HTMLElement).style.color = lightText
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.color =
                        lightTextSecondary
                    }}
                    asChild
                  >
                    <Link
                      href="https://x.com/21st_dev"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-sm transition-colors hover:bg-transparent"
                    style={{
                      color: lightTextSecondary,
                    }}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(116, 116, 122, 0.1)"
                      ;(e.currentTarget as HTMLElement).style.color = lightText
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.color =
                        lightTextSecondary
                    }}
                    asChild
                  >
                    <Link
                      href="https://github.com/serafimcloud/21st"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GitHubIcon className="h-4 w-4" aria-hidden="true" />
                      <GitHubStarsBasic className="inline-flex" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm transition-colors hover:bg-transparent"
                    style={{
                      color: lightTextSecondary,
                    }}
                    onClick={onEnterWebsite}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "rgba(116, 116, 122, 0.1)"
                      ;(e.currentTarget as HTMLElement).style.color = lightText
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLElement).style.background =
                        "transparent"
                      ;(e.currentTarget as HTMLElement).style.color =
                        lightTextSecondary
                    }}
                    asChild
                  >
                    <Link href="/pricing">Pricing</Link>
                  </Button>
                  {!user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm transition-colors hover:bg-transparent"
                      style={{
                        color: lightTextSecondary,
                      }}
                      onClick={onEnterWebsite}
                      onMouseOver={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background =
                          "rgba(116, 116, 122, 0.1)"
                        ;(e.currentTarget as HTMLElement).style.color =
                          lightText
                      }}
                      onMouseOut={(e) => {
                        ;(e.currentTarget as HTMLElement).style.background =
                          "transparent"
                        ;(e.currentTarget as HTMLElement).style.color =
                          lightTextSecondary
                      }}
                    >
                      Login
                    </Button>
                  )}
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col max-w-[300px] md:max-w-[800px] sm:max-w-[450px] text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      delay: 0.3,
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 md:mb-8 bg-clip-text text-transparent backdrop-blur-xl leading-[1.2] pb-1"
                    style={{
                      backgroundImage: lightGradient1,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Bring craft and taste back{" "}
                    <br className="hidden lg:inline" />
                    to digital products
                  </motion.h1>

                  <motion.h2
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl tracking-tight bg-clip-text text-transparent backdrop-blur-xl leading-[1.2] mb-8 md:mb-12 max-w-[600px] mx-auto"
                    style={{
                      backgroundImage: lightGradient2,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Build products that reflect the team's own taste{" "}
                    <br className="hidden lg:inline" />
                    instead of the LLM model's
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 justify-center mb-12"
                  >
                    {/* Mobile: Single Get Started button */}
                    <div className="block sm:hidden w-full">
                      <Button
                        onClick={onEnterWebsite}
                        data-test="landing-get-started-button"
                        className="w-full h-12 text-base font-medium hover:bg-transparent rounded-lg"
                        style={{
                          background: "#000000",
                          color: "#ffffff",
                          borderColor: "#000000",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        Get Started
                      </Button>
                    </div>

                    {/* Desktop: Two buttons */}
                    <div className="hidden sm:flex sm:flex-row items-center gap-4">
                      <Button
                        onClick={onEnterWebsite}
                        data-test="landing-browse-components-button"
                        className="whitespace-nowrap pr-1.5 font-normal hover:bg-transparent"
                        style={{
                          background: "#000000",
                          color: "#ffffff",
                          borderColor: "#000000",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        Browse components
                        <kbd
                          className="pointer-events-none h-5 select-none items-center gap-1 rounded px-1.5 ml-1.5 font-sans text-[11px] leading-none opacity-100 flex"
                          style={{
                            border: `1px solid #333333`,
                            background: "#1a1a1a",
                            color: "#ffffff",
                          }}
                        >
                          <EnterIcon className="h-2.5 w-2.5" />
                        </kbd>
                      </Button>

                      <Button
                        variant="ghost"
                        className="gap-0 transition-opacity duration-200 hover:bg-transparent"
                        style={{
                          borderColor: lightButtonBorder,
                          background: lightButtonBg,
                          color: lightText,
                          opacity: 0.6,
                        }}
                        asChild
                        onMouseOver={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            "rgba(116, 116, 122, 0.15)"
                          ;(e.currentTarget as HTMLElement).style.opacity =
                            "0.9"
                          ;(e.currentTarget as HTMLElement).style.color =
                            lightText
                        }}
                        onMouseOut={(e) => {
                          ;(e.currentTarget as HTMLElement).style.background =
                            lightButtonBg
                          ;(e.currentTarget as HTMLElement).style.opacity =
                            "0.6"
                          ;(e.currentTarget as HTMLElement).style.color =
                            lightText
                        }}
                      >
                        <Link href="/magic-chat" onClick={onEnterWebsite}>
                          Craft with AI
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>

                  {/* Company Logos */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-center"
                  >
                    <p
                      className="text-base sm:text-lg md:text-xl tracking-tight bg-clip-text text-transparent backdrop-blur-xl leading-[1.2] max-w-[600px] mx-auto mb-4"
                      style={{
                        backgroundImage: lightGradient3,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Optimized for
                    </p>
                    <div className="flex flex-col gap-2">
                      {/* IDE Logos */}
                      <div
                        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-12 max-w-[350px] md:max-w-[800px] mx-auto"
                        style={{ color: lightText }}
                      >
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <CursorAnimatedLogoIcon />
                          <CursorLogoIcon className="h-3 sm:h-4 w-auto" />
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <div className="h-[36px]">
                            <WindsurfLogoIcon className="h-full w-auto" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <div className="h-[36px]">
                            <ClaudeCodeLogoIcon className="h-full w-auto" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <div className="flex items-center gap-3">
                            <VscodeIcon className="w-6 h-6 mr-1" />
                            <span
                              className="text-sm"
                              style={{ color: lightTextMuted }}
                            >
                              +
                            </span>
                            <div className="flex items-center gap-2 bg-gradient-to-b from-[#0E0F0F] to-[#0C0C0C] overflow-hidden rounded-xl border border-white/10 w-[36px] h-[36px]">
                              <img
                                src="https://avatars.githubusercontent.com/u/184127137?s=200&v=4"
                                alt="Cline"
                                width={36}
                                height={36}
                                className="mix-blend-hard-light"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Other Company Logos */}
                      <div
                        className="hidden md:flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-12 max-w-[350px] md:max-w-[800px] mx-auto"
                        style={{ color: lightText }}
                      >
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <V0LogoIcon className="h-6 sm:h-8 w-auto" />
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[30%] sm:basis-auto justify-center">
                          <BoltLogoIcon className="h-5 sm:h-6 w-auto" />
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[45%] sm:basis-auto justify-center">
                          <LovableLogoIcon className="h-5 sm:h-6 w-auto" />
                          <span
                            className="text-[16px] sm:text-[20px] font-bold"
                            style={{ color: lightLogoText }}
                          >
                            lovable
                          </span>
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-200 basis-[45%] sm:basis-auto justify-center overflow-hidden max-w-[100px]">
                          <ReplitWithTextIcon className="h-12 sm:h-16 w-auto min-w-[120px] sm:min-w-[150px]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
