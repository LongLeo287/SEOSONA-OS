// Backdrop Filter Debug Utility
// Добавьте этот скрипт в консоль браузера для диагностики проблем с backdrop-filter

function debugBackdropFilter() {
  console.log("=== Backdrop Filter Debug Info ===")

  // Проверка поддержки CSS
  const backdropSupport = CSS.supports("backdrop-filter", "blur(1px)")
  const webkitSupport = CSS.supports("-webkit-backdrop-filter", "blur(1px)")

  console.log("✅ CSS.supports backdrop-filter:", backdropSupport)
  console.log("✅ CSS.supports -webkit-backdrop-filter:", webkitSupport)

  if (!backdropSupport && !webkitSupport) {
    console.error("❌ backdrop-filter NOT SUPPORTED")
    console.log("💡 Solution: Use fallback background colors")
  }

  // Информация о браузере
  console.log("🌐 User Agent:", navigator.userAgent)

  // Проверка аппаратного ускорения
  const canvas = document.createElement("canvas")
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  const hardwareAccel = gl ? "Available" : "Not available"
  console.log("🚀 Hardware acceleration:", hardwareAccel)

  if (hardwareAccel === "Not available") {
    console.warn(
      "⚠️ Hardware acceleration disabled - backdrop-filter may not work",
    )
  }

  // Тест производительности
  console.log("🧪 Running performance test...")
  const testEl = document.createElement("div")
  testEl.style.cssText = `
    position: fixed;
    top: -100px;
    left: -100px;
    width: 100px;
    height: 100px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.5);
    z-index: 9999;
  `

  const startTime = performance.now()
  document.body.appendChild(testEl)

  setTimeout(() => {
    const endTime = performance.now()
    document.body.removeChild(testEl)
    console.log(`⏱️ Test completed in ${(endTime - startTime).toFixed(2)}ms`)

    if (endTime - startTime > 100) {
      console.warn(
        "⚠️ Slow performance detected - consider reducing backdrop-filter usage",
      )
    }
  }, 100)

  // Проверка существующих элементов с backdrop-filter
  const elementsWithBackdrop = document.querySelectorAll(
    '[class*="backdrop-blur"]',
  )
  console.log(
    `🔍 Found ${elementsWithBackdrop.length} elements with backdrop-blur classes`,
  )

  elementsWithBackdrop.forEach((el, index) => {
    const computed = getComputedStyle(el)
    const hasBackdropFilter =
      computed.backdropFilter && computed.backdropFilter !== "none"
    console.log(`Element ${index + 1}:`, {
      element: el,
      backdropFilter: computed.backdropFilter,
      working: hasBackdropFilter,
    })
  })

  // Рекомендации
  console.log("\n💡 Recommendations:")
  console.log(
    "1. Use solid colors as fallbacks: bg-white instead of bg-white/80",
  )
  console.log("2. Add @supports rules for progressive enhancement")
  console.log("3. Test on different devices and browsers")
  console.log("4. Consider performance impact on mobile devices")

  return {
    backdropSupport,
    webkitSupport,
    hardwareAccel,
    elementsCount: elementsWithBackdrop.length,
  }
}

// Автоматически запускаем при загрузке скрипта
if (typeof window !== "undefined") {
  debugBackdropFilter()
}
