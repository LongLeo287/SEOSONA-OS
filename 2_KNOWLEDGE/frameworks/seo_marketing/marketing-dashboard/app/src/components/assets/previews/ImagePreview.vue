<template>
  <div class="relative h-full flex flex-col bg-black">
    <!-- Top Controls Bar -->
    <div class="flex items-center justify-between p-4 bg-zinc-900/90 backdrop-blur border-b border-zinc-700">
      <div class="flex items-center gap-2">
        <!-- Zoom Controls -->
        <button
          @click="zoomOut"
          class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
          title="Zoom Out"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>

        <div class="px-3 py-1 bg-zinc-800 rounded text-sm text-zinc-300 font-mono min-w-[80px] text-center">
          {{ Math.round(scale * 100) }}%
        </div>

        <button
          @click="zoomIn"
          class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
          title="Zoom In"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        <div class="w-px h-6 bg-zinc-700 mx-2"></div>

        <!-- Fit Controls -->
        <button
          @click="resetZoom"
          class="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
        >
          Fit
        </button>

        <button
          @click="zoomTo100"
          class="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
        >
          100%
        </button>
      </div>

      <div class="flex items-center gap-2">
        <!-- Download Button -->
        <button
          @click="downloadImage"
          class="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>

        <!-- Copy URL Button -->
        <button
          @click="copyUrl"
          class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded transition-colors"
          title="Copy Image URL"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Image Container -->
    <div
      ref="containerRef"
      class="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel="handleWheel"
    >
      <div
        class="absolute inset-0 flex items-center justify-center transition-transform duration-200"
        :style="{
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`
        }"
      >
        <img
          ref="imageRef"
          :src="imageUrl"
          :alt="asset.name"
          class="max-w-none select-none"
          @load="onImageLoad"
          @dragstart.prevent
        />
      </div>
    </div>

    <!-- Bottom Info Panel -->
    <div class="p-4 bg-zinc-900/90 backdrop-blur border-t border-zinc-700">
      <div class="grid grid-cols-4 gap-4 text-sm">
        <div>
          <div class="text-zinc-400 mb-1">Dimensions</div>
          <div class="text-zinc-100 font-mono">
            {{ imageDimensions.width }} × {{ imageDimensions.height }}
          </div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">File Size</div>
          <div class="text-zinc-100">{{ formatSize(asset.size_bytes) }}</div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">Format</div>
          <div class="text-zinc-100 uppercase">{{ asset.format }}</div>
        </div>
        <div>
          <div class="text-zinc-400 mb-1">Aspect Ratio</div>
          <div class="text-zinc-100">{{ aspectRatio }}</div>
        </div>
      </div>
    </div>

    <!-- Keyboard Shortcuts Hint -->
    <div class="absolute bottom-20 right-4 bg-zinc-900/95 backdrop-blur rounded-lg p-3 text-xs text-zinc-400 border border-zinc-700">
      <div class="font-semibold text-zinc-100 mb-2">Keyboard Shortcuts</div>
      <div class="space-y-1">
        <div><kbd class="px-1.5 py-0.5 bg-zinc-800 rounded">+</kbd> Zoom in</div>
        <div><kbd class="px-1.5 py-0.5 bg-zinc-800 rounded">-</kbd> Zoom out</div>
        <div><kbd class="px-1.5 py-0.5 bg-zinc-800 rounded">0</kbd> Reset zoom</div>
        <div><kbd class="px-1.5 py-0.5 bg-zinc-800 rounded">Esc</kbd> Close preview</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const containerRef = ref(null)
const imageRef = ref(null)
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)
const imageDimensions = ref({ width: 0, height: 0 })

const imageUrl = computed(() => {
  const path = props.asset.path || props.asset.local_path
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api/assets/file/${path}`
})

const aspectRatio = computed(() => {
  if (!imageDimensions.value.width || !imageDimensions.value.height) return 'Unknown'
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(imageDimensions.value.width, imageDimensions.value.height)
  const ratioW = imageDimensions.value.width / divisor
  const ratioH = imageDimensions.value.height / divisor
  return `${ratioW}:${ratioH}`
})

const onImageLoad = (e) => {
  imageDimensions.value = {
    width: e.target.naturalWidth,
    height: e.target.naturalHeight
  }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 5)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

const zoomTo100 = () => {
  scale.value = 1
  panX.value = 0
  panY.value = 0
}

const resetZoom = () => {
  scale.value = 1
  panX.value = 0
  panY.value = 0
}

const handleWheel = (e) => {
  e.preventDefault()
  if (e.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const startPan = (e) => {
  if (scale.value === 1) return
  isPanning.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
}

const pan = (e) => {
  if (!isPanning.value) return
  panX.value = e.clientX - startX.value
  panY.value = e.clientY - startY.value
}

const endPan = () => {
  isPanning.value = false
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = imageUrl.value
  link.download = props.asset.name
  link.click()
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(imageUrl.value)
    // Could add toast notification
  } catch (err) {
    console.error('Failed to copy URL:', err)
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

const handleKeyPress = (e) => {
  if (e.key === '+' || e.key === '=') {
    zoomIn()
  } else if (e.key === '-' || e.key === '_') {
    zoomOut()
  } else if (e.key === '0') {
    resetZoom()
  } else if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
</style>
