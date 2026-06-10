<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="asset"
        class="fixed inset-0 z-50 flex flex-col bg-zinc-900"
        @click.self="handleClose"
      >
        <!-- Header (full width) -->
        <div class="w-full flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-700 shrink-0">
            <div class="flex items-center gap-3">
              <!-- File Type Icon -->
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="iconBackgroundClass"
              >
                <component :is="fileIcon" class="w-6 h-6" :class="iconColorClass" />
              </div>

              <!-- File Info -->
              <div>
                <h2 class="text-lg font-semibold text-zinc-100">{{ asset.name }}</h2>
                <p class="text-sm text-zinc-400">{{ asset.path || asset.local_path }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Related Assets Toggle -->
              <button
                v-if="hasRelated"
                @click="showRelated = !showRelated"
                :class="[
                  'p-2 rounded-full transition-colors',
                  showRelated ? 'text-orange-400 bg-orange-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'
                ]"
                title="Related Assets"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>

              <!-- Close Button -->
              <button
                @click="handleClose"
                class="p-2 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-700 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>
        </div>

        <!-- Content Container (full width) -->
        <div class="flex-1 overflow-hidden flex w-full">
          <!-- Main Preview (full width, content inside has max-width) -->
          <div class="flex-1 overflow-hidden bg-zinc-900">
              <component
                :is="previewComponent"
                :asset="asset"
                @close="handleClose"
              />
            </div>

            <!-- Related Assets Sidebar -->
            <Transition name="slide">
              <div
                v-if="showRelated && hasRelated"
                class="w-72 bg-zinc-900 border-l border-zinc-700 overflow-y-auto shrink-0"
              >
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Related Assets</h3>

                  <!-- Same Folder -->
                  <div v-if="sameFolderAssets.length > 0" class="mb-6">
                    <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Same Folder
                    </div>
                    <div class="space-y-1">
                      <button
                        v-for="related in sameFolderAssets"
                        :key="related.id"
                        @click="selectAsset(related)"
                        class="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        <div class="text-sm text-zinc-200 truncate">{{ related.name }}</div>
                        <div class="text-xs text-zinc-500">{{ related.format }}</div>
                      </button>
                    </div>
                  </div>

                  <!-- References -->
                  <div v-if="referencedAssets.length > 0" class="mb-6">
                    <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      </svg>
                      References
                    </div>
                    <div class="space-y-1">
                      <button
                        v-for="related in referencedAssets"
                        :key="related.id"
                        @click="selectAsset(related)"
                        class="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        <div class="text-sm text-zinc-200 truncate">{{ related.name }}</div>
                        <div class="text-xs text-zinc-500">{{ related.format }}</div>
                      </button>
                    </div>
                  </div>

                  <!-- Referenced By -->
                  <div v-if="referencedByAssets.length > 0">
                    <div class="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                      </svg>
                      Referenced By
                    </div>
                    <div class="space-y-1">
                      <button
                        v-for="related in referencedByAssets"
                        :key="related.id"
                        @click="selectAsset(related)"
                        class="w-full text-left px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        <div class="text-sm text-zinc-200 truncate">{{ related.name }}</div>
                        <div class="text-xs text-zinc-500">{{ related.format }}</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
        </div>

        <!-- Footer Actions (for generic files) -->
        <div
          v-if="previewComponent === 'GenericPreview'"
          class="px-6 py-4 bg-zinc-900 border-t border-zinc-700 shrink-0"
        >
          <div class="flex items-center justify-between">
            <div class="grid grid-cols-3 gap-6 text-sm flex-1">
              <div>
                <div class="text-zinc-400 mb-1">Category</div>
                <div class="text-zinc-100">{{ asset.category || 'Uncategorized' }}</div>
              </div>
              <div>
                <div class="text-zinc-400 mb-1">File Size</div>
                <div class="text-zinc-100">{{ formatSize(asset.size_bytes) }}</div>
              </div>
              <div>
                <div class="text-zinc-400 mb-1">Type</div>
                <div class="text-zinc-100">{{ asset.format_type }}</div>
              </div>
            </div>

            <a
              v-if="asset.local_path"
              :href="getAssetUrl(asset.local_path)"
              download
              class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium ml-6"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download File
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import MarkdownPreview from './previews/MarkdownPreview.vue'
import ImagePreview from './previews/ImagePreview.vue'
import VideoPreview from './previews/VideoPreview.vue'
import CodePreview from './previews/CodePreview.vue'
import SlidePreview from './previews/SlidePreview.vue'
import StoryboardPreview from './previews/StoryboardPreview.vue'
import TranscriptPreview from './previews/TranscriptPreview.vue'
import InfographicPreview from './previews/InfographicPreview.vue'
import SocialPostPreview from './previews/SocialPostPreview.vue'
import JsonVisualizer from './previews/JsonVisualizer.vue'

const props = defineProps({
  asset: {
    type: Object,
    default: null
  },
  allAssets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

// Determine which preview component to use
const previewComponent = computed(() => {
  if (!props.asset) return null

  const format = props.asset.format?.toLowerCase()
  const path = props.asset.path || props.asset.local_path || ''
  // Prefer formatType from live scan over format_type from DB (scan is more current)
  const formatType = (props.asset.formatType || props.asset.format_type)?.toLowerCase()

  // Slides (HTML in slides/ folder, detected by scanner)
  if (formatType === 'slide') {
    return SlidePreview
  }

  // Storyboards (MD files in storyboards/ folder)
  if (formatType === 'storyboard') {
    return StoryboardPreview
  }

  // Storyboard JSON files (storyboard.json in storyboards/ folder)
  if (format === 'json' && (path.includes('/storyboards/') || path.startsWith('storyboards/')) && props.asset.name === 'storyboard') {
    return StoryboardPreview
  }

  // Transcripts (MD files in transcripts/ folder)
  if (formatType === 'transcript') {
    return TranscriptPreview
  }

  // Infographics (HTML files in infographics/ folder)
  if (format === 'html' && (path.includes('/infographics/') || path.startsWith('infographics/'))) {
    return InfographicPreview
  }

  // Social Posts (multi-platform posts in posts/ folder)
  if (format === 'md' && (path.includes('/posts/') || path.startsWith('posts/')) &&
      (props.asset.name?.includes('all-platforms') || props.asset.name?.includes('platforms'))) {
    return SocialPostPreview
  }

  // Markdown files
  if (format === 'md') {
    return MarkdownPreview
  }

  // Images
  if (formatType === 'image' || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(format)) {
    return ImagePreview
  }

  // Videos
  if (formatType === 'video' || ['mp4', 'webm', 'ogg', 'mov'].includes(format)) {
    return VideoPreview
  }

  // JSON files - use visual explorer
  if (format === 'json') {
    return JsonVisualizer
  }

  // Code files
  if (['js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'py', 'sh', 'bash'].includes(format)) {
    return CodePreview
  }

  // Default generic preview
  return 'GenericPreview'
})

// File type icon
const fileIcon = computed(() => {
  const format = props.asset.format?.toLowerCase()
  const formatType = (props.asset.formatType || props.asset.format_type)?.toLowerCase()

  // Slides
  if (formatType === 'slide') {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
      })
    ])
  }

  // Storyboards
  if (formatType === 'storyboard') {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      })
    ])
  }

  if (format === 'md') {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
      })
    ])
  }

  if (formatType === 'image') {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
      })
    ])
  }

  if (formatType === 'video') {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
      })
    ])
  }

  // Code files
  return h('svg', {
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24'
  }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    })
  ])
})

const iconBackgroundClass = computed(() => {
  const format = props.asset.format?.toLowerCase()
  const formatType = (props.asset.formatType || props.asset.format_type)?.toLowerCase()

  if (formatType === 'slide') return 'bg-teal-500/20'
  if (formatType === 'storyboard') return 'bg-amber-500/20'
  if (format === 'md') return 'bg-blue-500/20'
  if (formatType === 'image') return 'bg-purple-500/20'
  if (formatType === 'video') return 'bg-pink-500/20'
  return 'bg-orange-500/20'
})

const iconColorClass = computed(() => {
  const format = props.asset.format?.toLowerCase()
  const formatType = (props.asset.formatType || props.asset.format_type)?.toLowerCase()

  if (formatType === 'slide') return 'text-teal-400'
  if (formatType === 'storyboard') return 'text-amber-400'
  if (format === 'md') return 'text-blue-400'
  if (formatType === 'image') return 'text-purple-400'
  if (formatType === 'video') return 'text-pink-400'
  return 'text-orange-400'
})

// Related assets sidebar
const showRelated = ref(false)

// Get folder path for current asset
const assetFolder = computed(() => {
  const path = props.asset?.path || props.asset?.local_path || ''
  const lastSlash = path.lastIndexOf('/')
  return lastSlash > 0 ? path.substring(0, lastSlash) : ''
})

// Same folder assets (excluding current)
const sameFolderAssets = computed(() => {
  if (!assetFolder.value || !props.allAssets.length) return []
  const currentPath = props.asset?.path || props.asset?.local_path
  return props.allAssets.filter(a => {
    const aPath = a.path || a.local_path
    if (aPath === currentPath) return false
    return aPath?.startsWith(assetFolder.value + '/')
  }).slice(0, 10)
})

// Assets this file references
const referencedAssets = computed(() => {
  const refs = props.asset?.references || []
  if (!refs.length) return []
  return props.allAssets.filter(a => {
    const aPath = a.path || a.local_path
    return refs.some(ref => aPath?.endsWith(ref) || ref === aPath)
  })
})

// Assets that reference this file
const referencedByAssets = computed(() => {
  const refs = props.asset?.referencedBy || []
  if (!refs.length) return []
  return props.allAssets.filter(a => {
    const aPath = a.path || a.local_path
    return refs.some(ref => aPath?.endsWith(ref) || ref === aPath)
  })
})

// Check if there are any related assets
const hasRelated = computed(() => {
  return sameFolderAssets.value.length > 0 ||
         referencedAssets.value.length > 0 ||
         referencedByAssets.value.length > 0
})

const handleClose = () => {
  emit('close')
}

const selectAsset = (asset) => {
  emit('select', asset)
}

const getAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/api/assets/file/${path}`
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
</script>

<script>
// Generic Preview Component (inline)
const GenericPreview = {
  name: 'GenericPreview',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="flex items-center justify-center h-full bg-zinc-900">
      <div class="text-center py-12">
        <div class="text-zinc-400 mb-4">
          <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-zinc-100 mb-2">{{ asset.name }}</h3>
        <p class="text-zinc-400 mb-4">Preview not available for this file type</p>
        <p class="text-sm text-zinc-500">{{ asset.format_type }} file</p>
      </div>
    </div>
  `
}

export default {
  components: {
    GenericPreview
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

/* Slide transition for related sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
