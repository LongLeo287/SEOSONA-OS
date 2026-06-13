"use client"

import { AuthDoodle } from "./auth-doodle"
import { SmallStarDoodle } from "./doodles/small-star-doodle"
import { TriangleDoodle } from "./doodles/triangle-doodle"
import { CircleDoodle } from "./doodles/circle-doodle"

export function AuthPatternDialog() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background Pattern - using CSS for theme switching */}
      <div
        className="absolute inset-0 opacity-50 bg-[length:800px_800px] bg-center bg-repeat dark:bg-[url('/auth/pattern-dark.png')] bg-[url('/auth/pattern-light.png')]"
        style={{
          transform: "rotate(12deg) scale(1.5)",
        }}
      />

      {/* Desktop - decorative elements */}
      {/* Top Far Right - Blue Circle */}
      <AuthDoodle className="top-[5%] right-[8%] hidden lg:block">
        <CircleDoodle color="#0033FF" size={10} />
      </AuthDoodle>

      {/* Bottom Far Left - Pink Star */}
      <AuthDoodle className="bottom-[8%] left-[5%] hidden lg:block">
        <SmallStarDoodle color="#E6BFFF" />
      </AuthDoodle>

      {/* Bottom Right Far - Pink Triangle */}
      <AuthDoodle className="bottom-[28%] right-[8%] hidden lg:block">
        <TriangleDoodle color="#E6BFFF" />
      </AuthDoodle>

    </div>
  )
}
