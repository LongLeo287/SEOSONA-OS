<template>
  <div class="h-full flex flex-col bg-zinc-950">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-3 bg-zinc-900/95 border-b border-zinc-700">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-zinc-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-sm font-medium text-zinc-300">Infographic</span>
        </div>
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
          @click="downloadFile"
          class="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>

    <!-- Infographic Iframe -->
    <div ref="containerRef" class="flex-1 relative overflow-hidden bg-black">
      <iframe
        v-if="blobUrl"
        ref="iframeRef"
        :src="blobUrl"
        class="absolute inset-0 w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        referrerpolicy="no-referrer"
      ></iframe>

      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-zinc-950">
        <div class="text-center">
          <div class="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div class="text-zinc-400 text-sm">Loading infographic...</div>
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
            <span class="text-zinc-300 ml-2">{{ formatSize(asset.size_bytes || asset.size) }}</span>
          </div>
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

// Fetch HTML content and create blob URL
const fetchAndRender = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await fetch(`/api/assets/${props.asset.id}/content`)
    if (!response.ok) throw new Error('Failed to load infographic')

    const data = await response.json()
    htmlContent.value = data.content

    // Create blob URL for rendering
    const blob = new Blob([data.content], { type: 'text/html' })
    blobUrl.value = URL.createObjectURL(blob)

  } catch (err) {
    console.error('[InfographicPreview] Failed to load:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const openInNewTab = () => {
  if (blobUrl.value) {
    window.open(blobUrl.value, '_blank')
  }
}

const downloadFile = () => {
  if (htmlContent.value) {
    const blob = new Blob([htmlContent.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${props.asset.name}.html`
    a.click()
    URL.revokeObjectURL(url)
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
  fetchAndRender()
})

onUnmounted(() => {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
})
</script>
