<template>
  <div
    class="group relative bg-surface rounded-xl border border-border overflow-hidden card-glow cursor-pointer"
    @click="$emit('view', asset)"
  >
    <!-- Thumbnail Area -->
    <div class="aspect-[4/3] bg-surface-elevated relative overflow-hidden">
      <!-- Image Thumbnail -->
      <img
        v-if="isImage"
        :src="thumbnailUrl"
        :alt="asset.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="imageError = true"
      />

      <!-- Fallback for failed images -->
      <div v-else-if="isImage && imageError" class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs text-text-muted">Image unavailable</span>
        </div>
      </div>

      <!-- Slide Thumbnail -->
      <div v-else-if="isSlide" class="w-full h-full slide-placeholder relative">
        <!-- Gradient background mimicking slide style -->
        <div class="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10"></div>
        </div>
        <!-- Content -->
        <div class="relative h-full flex flex-col items-center justify-center p-4 text-center">
          <!-- Title -->
          <h4 class="text-xs font-semibold text-white/90 line-clamp-2 mb-2 leading-tight">
            {{ slideTitle || asset.name }}
          </h4>
          <!-- Slide count badge -->
          <div class="flex items-center gap-1 text-[10px] text-zinc-400">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            {{ slideCount || '?' }} slides
          </div>
          <!-- Mini slide indicators -->
          <div class="flex gap-0.5 mt-2">
            <div v-for="i in Math.min(slideCount || 3, 5)" :key="i" class="w-1.5 h-1 rounded-full" :class="i === 1 ? 'bg-teal-400' : 'bg-zinc-600'"></div>
            <div v-if="(slideCount || 0) > 5" class="text-[8px] text-zinc-500 ml-0.5">+{{ slideCount - 5 }}</div>
          </div>
        </div>
      </div>

      <!-- Infographic Thumbnail -->
      <div v-else-if="isInfographic" class="w-full h-full relative">
        <!-- Gradient background for infographic -->
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-amber-500/10"></div>
        </div>
        <!-- Content -->
        <div class="relative h-full flex flex-col items-center justify-center p-4 text-center">
          <!-- Chart icon -->
          <svg class="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <!-- Title -->
          <h4 class="text-xs font-semibold text-white/90 line-clamp-2 leading-tight">
            {{ asset.name }}
          </h4>
          <!-- Badge -->
          <div class="flex items-center gap-1 text-[10px] text-amber-400 mt-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Infographic
          </div>
        </div>
      </div>

      <!-- Non-image File Types -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <!-- Video -->
          <div v-if="isVideo" class="relative">
            <svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div class="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded">
              {{ formatExtension }}
            </div>
          </div>

          <!-- Markdown/Document -->
          <div v-else-if="isDocument" class="relative">
            <svg class="w-16 h-16 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-secondary/20 text-secondary text-[10px] font-medium rounded uppercase">
              {{ formatExtension }}
            </div>
          </div>

          <!-- Code -->
          <div v-else-if="isCode" class="relative">
            <svg class="w-16 h-16 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <div class="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-accent/20 text-accent text-[10px] font-medium rounded uppercase">
              {{ formatExtension }}
            </div>
          </div>

          <!-- Generic File -->
          <div v-else class="relative">
            <svg class="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div class="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-surface text-text-muted text-[10px] font-medium rounded border border-border uppercase">
              {{ formatExtension }}
            </div>
          </div>
        </div>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          @click.stop="$emit('view', asset)"
          class="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          title="Preview"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          @click.stop="copyPath"
          class="p-2 bg-surface-elevated text-text-primary rounded-lg hover:bg-border transition-colors"
          title="Copy Path"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <!-- Format Badge (top-left) -->
      <div class="absolute top-2 left-2">
        <span :class="formatBadgeClass" class="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full">
          {{ formatLabel }}
        </span>
      </div>
    </div>

    <!-- Info Area -->
    <div class="p-3">
      <h3 class="font-medium text-text-primary text-sm truncate" :title="asset.name">
        {{ asset.name }}
      </h3>

      <!-- Folder Path -->
      <div class="text-xs text-text-muted truncate mt-1" :title="folderPath">
        {{ folderPath }}
      </div>

      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center gap-2">
          <span v-if="asset.category" class="text-xs text-secondary font-medium">
            {{ asset.category }}
          </span>
          <span v-else class="text-xs text-text-muted">—</span>

          <!-- Relationship badges -->
          <span
            v-if="referencesCount > 0"
            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-medium"
            :title="`References ${referencesCount} assets`"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            </svg>
            {{ referencesCount }}
          </span>
          <span
            v-if="referencedByCount > 0"
            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium"
            :title="`Referenced by ${referencedByCount} assets`"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            {{ referencedByCount }}
          </span>
        </div>

        <span class="text-xs text-text-muted">{{ formatSize(asset.size_bytes || asset.size) }}</span>
      </div>
    </div>

    <!-- Copied Toast -->
    <transition name="fade">
      <div v-if="showCopied" class="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs rounded-full">
        Copied!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true
  }
})

defineEmits(['view'])

const imageError = ref(false)
const showCopied = ref(false)

// Folder path (without filename)
const folderPath = computed(() => {
  const path = props.asset.path || props.asset.local_path || ''
  const lastSlash = path.lastIndexOf('/')
  return lastSlash > 0 ? path.substring(0, lastSlash) : ''
})

// Relationship counts
const referencesCount = computed(() => props.asset.references?.length || 0)
const referencedByCount = computed(() => props.asset.referencedBy?.length || 0)

// File type detection
const formatExtension = computed(() => {
  const format = props.asset.format || ''
  return format.replace('.', '')
})

const isImage = computed(() => {
  const format = formatExtension.value.toLowerCase()
  return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(format)
})

const isVideo = computed(() => {
  const format = formatExtension.value.toLowerCase()
  return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(format)
})

const isDocument = computed(() => {
  const format = formatExtension.value.toLowerCase()
  return ['md', 'txt', 'pdf', 'doc', 'docx', 'rtf'].includes(format)
})

const isCode = computed(() => {
  const format = formatExtension.value.toLowerCase()
  return ['js', 'ts', 'jsx', 'tsx', 'vue', 'py', 'json', 'html', 'css', 'scss', 'yaml', 'yml', 'sh'].includes(format)
})

// Slide detection (by formatType from scanner)
const isSlide = computed(() => {
  const formatType = (props.asset.formatType || props.asset.format_type || '').toLowerCase()
  return formatType === 'slide'
})

// Infographic detection (HTML in infographics folder)
const isInfographic = computed(() => {
  const path = props.asset.path || props.asset.local_path || ''
  const format = formatExtension.value.toLowerCase()
  return format === 'html' && (path.includes('/infographics/') || path.startsWith('infographics/'))
})

const slideTitle = computed(() => props.asset.meta?.slideTitle || null)
const slideCount = computed(() => props.asset.meta?.slideCount || 0)

// Thumbnail URL via API
const thumbnailUrl = computed(() => {
  if (!props.asset.path) return ''
  return `/api/assets/file/${props.asset.path}`
})

// Format badge styling
const formatLabel = computed(() => {
  if (isSlide.value) return 'Slide'
  if (isInfographic.value) return 'Infographic'
  if (isImage.value) return 'Image'
  if (isVideo.value) return 'Video'
  if (isDocument.value) return 'Doc'
  if (isCode.value) return 'Code'
  return 'File'
})

const formatBadgeClass = computed(() => {
  if (isSlide.value) return 'bg-teal-500/20 text-teal-400'
  if (isInfographic.value) return 'bg-blue-500/20 text-blue-400'
  if (isImage.value) return 'bg-green-500/20 text-green-400'
  if (isVideo.value) return 'bg-primary/20 text-primary'
  if (isDocument.value) return 'bg-secondary/20 text-secondary'
  if (isCode.value) return 'bg-accent/20 text-accent'
  return 'bg-surface text-text-muted border border-border'
})

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const copyPath = async () => {
  try {
    await navigator.clipboard.writeText(props.asset.path)
    showCopied.value = true
    setTimeout(() => showCopied.value = false, 1500)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
