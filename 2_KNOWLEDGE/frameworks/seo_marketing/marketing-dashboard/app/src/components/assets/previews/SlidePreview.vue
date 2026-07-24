<template>
  <div class="h-full flex flex-col bg-zinc-950">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-3 bg-zinc-900/95 border-b border-zinc-700">
      <div class="flex items-center gap-3">
        <!-- Navigation Buttons -->
        <button
          @click="prevSlide"
          class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          title="Previous (←)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="px-3 py-1 bg-zinc-800 rounded text-sm text-zinc-300 font-mono min-w-[80px] text-center">
          {{ currentSlide }} / {{ totalSlides }}
        </div>

        <button
          @click="nextSlide"
          class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          title="Next (→)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="w-px h-6 bg-zinc-700 mx-2"></div>

        <!-- Presentation Mode -->
        <button
          @click="toggleFullscreen"
          class="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Present
        </button>
      </div>

      <div class="flex items-center gap-2">
        <!-- Open in New Tab -->
        <button
          @click="openInNewTab"
          class="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open
        </button>

        <!-- Download -->
        <button
          @click="downloadSlide"
          class="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>

    <!-- Slide Iframe (rendered via blob URL - CSS/JS isolated from parent) -->
    <!-- Blob URL creates unique origin, preventing style/script leakage -->
    <div ref="containerRef" class="flex-1 relative overflow-hidden bg-black slide-container">
      <iframe
        v-if="blobUrl"
        ref="iframeRef"
        :src="blobUrl"
        class="absolute inset-0 w-full h-full border-0"
        @load="onIframeLoad"
        sandbox="allow-scripts allow-same-origin"
        referrerpolicy="no-referrer"
      ></iframe>

      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-zinc-950">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div class="text-zinc-400 text-sm">Loading slides...</div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-zinc-950">
        <div class="text-center text-red-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Info Bar -->
    <div class="px-4 py-3 bg-zinc-900/95 border-t border-zinc-700">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-6">
          <div>
            <span class="text-zinc-500">File:</span>
            <span class="text-zinc-300 ml-2">{{ asset.name }}</span>
          </div>
          <div>
            <span class="text-zinc-500">Size:</span>
            <span class="text-zinc-300 ml-2">{{ formatSize(asset.size_bytes) }}</span>
          </div>
        </div>
        <div class="text-zinc-500 text-xs">
          <kbd class="px-1.5 py-0.5 bg-zinc-800 rounded mr-1">←</kbd>
          <kbd class="px-1.5 py-0.5 bg-zinc-800 rounded mr-1">→</kbd>
          or click to navigate
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const iframeRef = ref(null)
const containerRef = ref(null)
const loading = ref(true)
const error = ref(null)
const blobUrl = ref(null)
const htmlContent = ref('')
const currentSlide = ref(1)
const totalSlides = ref(7)

// Fetch HTML content and create blob URL (like Claude Artifacts)
const fetchAndRenderSlides = async () => {
  try {
    loading.value = true
    error.value = null

    const path = props.asset.path || props.asset.local_path
    console.log('[SlidePreview] Loading slide:', path)

    const response = await fetch(`/api/assets/${props.asset.id}/content`)
    if (!response.ok) throw new Error('Failed to load slide content')

    const data = await response.json()
    htmlContent.value = data.content

    // Get the asset directory for relative path resolution
    const assetDir = path.substring(0, path.lastIndexOf('/'))
    console.log('[SlidePreview] Asset dir:', assetDir)

    // Find and fetch all local CSS files to inline them
    let fixedHtml = data.content
    const cssMatches = [...fixedHtml.matchAll(/<link[^>]+href="(\.\.\/[^"]+\.css)"[^>]*>/gi)]
    console.log('[SlidePreview] CSS links found:', cssMatches.length)

    for (const match of cssMatches) {
      const relPath = match[1]
      const resolvedPath = resolveRelativePath(assetDir, relPath)
      console.log('[SlidePreview] Inlining CSS:', relPath, '→', resolvedPath)

      try {
        const cssResponse = await fetch(`/api/assets/file/${resolvedPath}`)
        console.log('[SlidePreview] CSS fetch status:', cssResponse.status)

        if (cssResponse.ok) {
          const cssText = await cssResponse.text()
          console.log('[SlidePreview] CSS length:', cssText.length)
          // Replace link tag with inline style
          fixedHtml = fixedHtml.replace(match[0], `<style>\n/* Inlined: ${relPath} */\n${cssText}\n</style>`)
        } else {
          console.warn('[SlidePreview] CSS fetch failed:', cssResponse.status)
        }
      } catch (e) {
        console.warn('[SlidePreview] Failed to inline CSS:', relPath, e)
      }
    }

    // Fix any remaining relative paths for images/scripts
    fixedHtml = fixedHtml.replace(
      /(href|src)="(\.\.\/[^"]+)"/g,
      (match, attr, relPath) => {
        const resolved = resolveRelativePath(assetDir, relPath)
        return `${attr}="/api/assets/file/${resolved}"`
      }
    )

    // Create blob URL for rendering
    const blob = new Blob([fixedHtml], { type: 'text/html' })
    blobUrl.value = URL.createObjectURL(blob)
    console.log('[SlidePreview] Blob URL created:', blobUrl.value)

    // Extract total slides from HTML
    const slidesMatch = fixedHtml.match(/totalSlides['">\s]*(\d+)/i)
    if (slidesMatch) {
      totalSlides.value = parseInt(slidesMatch[1])
    }

  } catch (err) {
    console.error('[SlidePreview] Failed to load slides:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Resolve relative paths like ../../design-tokens.css
const resolveRelativePath = (baseDir, relativePath) => {
  const baseParts = baseDir.split('/').filter(Boolean)
  const relParts = relativePath.split('/')

  for (const part of relParts) {
    if (part === '..') {
      baseParts.pop()
    } else if (part !== '.') {
      baseParts.push(part)
    }
  }

  return baseParts.join('/')
}

const onIframeLoad = () => {
  // Try to sync slide counter
  try {
    const doc = iframeRef.value?.contentDocument
    if (doc) {
      const totalEl = doc.getElementById('totalSlides')
      if (totalEl) {
        totalSlides.value = parseInt(totalEl.textContent) || totalSlides.value
      }
    }
  } catch (e) {
    // Ignore cross-origin errors
  }
}

const sendKeyToIframe = (key) => {
  try {
    const iframeWindow = iframeRef.value?.contentWindow
    if (iframeWindow) {
      // Dispatch keyboard event to iframe document
      const event = new KeyboardEvent('keydown', {
        key,
        code: key === 'ArrowLeft' ? 'ArrowLeft' : 'ArrowRight',
        bubbles: true,
        cancelable: true
      })
      iframeWindow.document?.dispatchEvent(event)
    }
  } catch (e) {
    console.warn('Cannot send key to iframe:', e)
  }
}

const prevSlide = () => {
  sendKeyToIframe('ArrowLeft')
  if (currentSlide.value > 1) currentSlide.value--
}

const nextSlide = () => {
  sendKeyToIframe('ArrowRight')
  if (currentSlide.value < totalSlides.value) currentSlide.value++
}

const toggleFullscreen = () => {
  if (containerRef.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.value.requestFullscreen()
    }
  }
}

const openInNewTab = () => {
  if (blobUrl.value) {
    window.open(blobUrl.value, '_blank')
  }
}

const downloadSlide = () => {
  if (htmlContent.value) {
    const blob = new Blob([htmlContent.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = props.asset.name
    a.click()
    URL.revokeObjectURL(url)
  }
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'f') {
    toggleFullscreen()
  }
}

const formatSize = (bytes) => {
  if (!bytes) return 'Unknown'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

onMounted(() => {
  fetchAndRenderSlides()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // Clean up blob URL
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
})
</script>
